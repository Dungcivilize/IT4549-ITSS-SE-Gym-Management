package BE.ITSS.ITSS.Services;

import BE.ITSS.ITSS.DTO.*;
import BE.ITSS.ITSS.Models.Membership;
import BE.ITSS.ITSS.Models.MembershipPackage;
import BE.ITSS.ITSS.Repositories.MembershipPackageRepository;
import BE.ITSS.ITSS.Repositories.MembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    /**
     *
     */
    @Autowired
    private MembershipPackageRepository packageRepository;

    public void registerMembership(RegisterMembershipRequest request) {
        try {
            // ✅ In đầu vào
            System.out.println(">>> [DEBUG] memberId = " + request.getMemberId());
            System.out.println(">>> [DEBUG] packageId = " + request.getPackageId());

            MembershipPackage pack = packageRepository.findById(request.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Gói tập không tồn tại"));

            Membership membership = new Membership();
            membership.setMemberId(request.getMemberId());
            membership.setPackageId(request.getPackageId());
            membership.setStartDate(new Date(System.currentTimeMillis()));
            membership.setEndDate(new Date(System.currentTimeMillis() + pack.getDuration() * 86400000L));
            membership.setPaymentStatus("Chờ xác nhận");

            membershipRepository.save(membership);
        } catch (Exception e) {
            e.printStackTrace(); // 👈 In lỗi ra console
            throw new RuntimeException("Đăng ký thất bại: " + e.getMessage());
        }
    }

    public void savePaymentNote(SubmitPaymentNoteRequest request) {
        Membership m = membershipRepository.findByMemberIdAndPackageId(request.getMemberId(), request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký gói tập"));

        if (!"Chờ xác nhận".equals(m.getPaymentStatus())) {
            throw new RuntimeException("Gói tập không ở trạng thái chờ thanh toán.");
        }

        m.setPaymentNote(request.getPaymentNote());
        membershipRepository.save(m);
    }

    public List<RegisteredPackageResponse> getRegisteredPackages(Long memberId) {
        List<Membership> memberships = membershipRepository.findByMemberId(memberId);
        List<RegisteredPackageResponse> result = new ArrayList<>();

        for (Membership m : memberships) {
            MembershipPackage pack = packageRepository.findById(m.getPackageId())
                    .orElse(null); // null nếu dữ liệu bị lỗi

            if (pack == null) continue;

            RegisteredPackageResponse res = new RegisteredPackageResponse();
            res.setPackageName(pack.getPackageName());
            res.setStartDate(m.getStartDate());
            res.setEndDate(m.getEndDate());
            res.setPaymentStatus(m.getPaymentStatus());
            res.setPaymentNote(m.getPaymentNote());

            if ("Đã thanh toán".equals(m.getPaymentStatus())) {
                long diffMillis = m.getEndDate().getTime() - System.currentTimeMillis();
                long remainingDays = TimeUnit.MILLISECONDS.toDays(diffMillis);
                res.setRemainingDays(Math.max(remainingDays, 0)); // không âm
            }

            result.add(res);
        }

        return result;
    }

    public void confirmPayment(ConfirmPaymentRequest request) {
        Membership m = membershipRepository.findByMemberIdAndPackageId(
                request.getMemberId(), request.getPackageId()
        ).orElseThrow(() -> new RuntimeException("Không tìm thấy gói tập đã đăng ký"));

        if (!"Chờ xác nhận".equals(m.getPaymentStatus())) {
            throw new RuntimeException("Gói này đã được xác nhận hoặc huỷ trước đó");
        }

        m.setPaymentStatus("Đã thanh toán");
        m.setStartDate(new Date(System.currentTimeMillis()));

        // Tính toán thời hạn dựa trên gói
        MembershipPackage pack = packageRepository.findById(m.getPackageId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin gói tập"));
        m.setEndDate(new Date(System.currentTimeMillis() + pack.getDuration() * 86400000L));

        membershipRepository.save(m);
    }

    public void requestCancelPackage(CancelRequest request) {
        Membership m = membershipRepository.findByMemberIdAndPackageId(request.getMemberId(), request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói tập đã đăng ký."));

        if (!"Đã thanh toán".equals(m.getPaymentStatus())) {
            throw new RuntimeException("Chỉ có thể yêu cầu huỷ những gói đã thanh toán.");
        }

        m.setPaymentStatus("Yêu cầu huỷ gói tập");
        m.setPaymentNote("Yêu cầu huỷ: " + request.getCancelReason());
        membershipRepository.save(m);
    }

    public void confirmCancelPackage(CancelRequest request) {
        Membership m = membershipRepository
                .findByMemberIdAndPackageId(request.getMemberId(), request.getPackageId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói tập đã đăng ký"));

        // Chỉ cho xử lý nếu đang ở trạng thái yêu cầu huỷ
        if (!"Yêu cầu huỷ gói tập".equals(m.getPaymentStatus())) {
            throw new RuntimeException("Gói tập không ở trạng thái yêu cầu huỷ");
        }

        // Nếu admin đồng ý huỷ
        if ("Xác nhận huỷ".equalsIgnoreCase(request.getPaymentStatus())) {
            m.setPaymentStatus("Đã huỷ");
            m.setEndDate(new Date(System.currentTimeMillis())); // Cắt ngay nếu cần
        } else {
            // Admin từ chối huỷ, giữ lại trạng thái cũ, giả sử là "Paid"
            m.setPaymentStatus("Đã thanh toán");
            m.setPaymentNote(null); // Xoá lý do huỷ nếu không cần giữ lại
        }

        membershipRepository.save(m);
    }

    public void requestRenewal(RenewalRequest request) {
        Membership m = membershipRepository.findById(request.getMembershipId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói tập"));

        if (!"Đã thanh toán".equalsIgnoreCase(m.getPaymentStatus())) {
            throw new RuntimeException("Chỉ có thể gia hạn gói đã thanh toán.");
        }

        m.setPaymentStatus("Yêu cầu gia hạn");
        m.setPaymentNote("Yêu cầu gia hạn: " + request.getPaymentNote());

        membershipRepository.save(m);
    }

}
