package ITSS.Backend.Member.Service;

import ITSS.Backend.Member.DTO.*;
import ITSS.Backend.entity.Membership;
import ITSS.Backend.entity.MembershipPackage;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.MembershipPackageRepository;
import ITSS.Backend.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberMembershipService {

    private final MembershipRepository membershipRepository;
    private final MembershipPackageRepository membershipPackageRepository;

    public Optional<CurrentMembershipResponse> getCurrentMembership(Long userId) {
        Optional<Membership> opt = membershipRepository.findCurrentMembershipByUserId(userId);
        return opt.map(m -> {
            CurrentMembershipResponse dto = new CurrentMembershipResponse();
            dto.setMembershipId(m.getMembershipId());
            dto.setPackageName(m.getMembershipPackage().getPackageName());
            dto.setStartDate(m.getStartDate());
            dto.setEndDate(m.getEndDate());
            dto.setPaymentStatus(m.getPaymentStatus().toString());
            dto.setPackageId(m.getMembershipPackage().getPackageId());
            dto.setPtMeetingDaysLeft(m.getPtMeetingDaysLeft());
            return dto;
        });
    }

    public List<CurrentMembershipAdminResponse> getAllCurrentMemberships() {
        List<Membership> memberships = membershipRepository.findAllCurrentMemberships();
        return memberships.stream().map(m -> {
            CurrentMembershipAdminResponse dto = new CurrentMembershipAdminResponse();
            dto.setMembershipId(m.getMembershipId());
            dto.setMemberName(m.getMember().getFullname());
            dto.setPackageName(m.getMembershipPackage().getPackageName());
            dto.setStartDate(m.getStartDate());
            dto.setEndDate(m.getEndDate());
            dto.setPaymentStatus(m.getPaymentStatus().toString());
            return dto;
        }).toList();
    }

    public List<TrainerPackageSummaryResponse> getTrainerPackageSummaries() {
        return membershipRepository.findTrainerPackageSummaries();
    }

//    public void registerMembership(RegisterMembershipRequest req) {
//        // Tạo thực thể Membership
//        Membership membership = new Membership();
//
//        // Gán member (chỉ cần set ID)
//        User member = new User();
//        member.setUserId(req.getMemberId());
//        membership.setMember(member);
//
//        // Lấy MembershipPackage từ DB để lấy duration
//        MembershipPackage pkg = membershipPackageRepository.findById(req.getPackageId())
//                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói tập với ID: " + req.getPackageId()));
//        membership.setMembershipPackage(pkg);
//
//        // Gán trainer nếu có
//        User trainer = null;
//        if (req.getTrainerId() != null) {
//            trainer = new User();
//            trainer.setUserId(req.getTrainerId());
//        }
//        membership.setTrainer(trainer);
//
//        // Gán start_date là hôm nay, end_date là hôm nay + duration của gói
//        LocalDate today = LocalDate.now();
//        membership.setStartDate(today);
//        membership.setEndDate(today.plusDays(pkg.getDuration()));
//
//        // Gán trạng thái thanh toán mặc định
//        membership.setPaymentStatus(Membership.PaymentStatus.Unpaid);
//
//        // Lưu vào DB
//        membershipRepository.save(membership);
//    }
public void registerMembership(RegisterMembershipRequest req) {
    // Kiểm tra xem người dùng đã có gói tập chưa (còn hiệu lực)
    boolean hasCurrent = membershipRepository.existsByMember_UserIdAndPaymentStatusIn(
            req.getMemberId(),
            List.of(Membership.PaymentStatus.Unpaid, Membership.PaymentStatus.Paid, Membership.PaymentStatus.Processing)
    );

    if (hasCurrent) {
        throw new IllegalStateException("Người dùng đã có gói tập hiện tại. Không thể đăng ký thêm.");
    }

    // Tạo thực thể Membership
    Membership membership = new Membership();

    // Gán member
    User member = new User();
    member.setUserId(req.getMemberId());
    membership.setMember(member);

    // Lấy gói tập
    MembershipPackage pkg = membershipPackageRepository.findById(req.getPackageId())
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói tập với ID: " + req.getPackageId()));
    membership.setMembershipPackage(pkg);

    // Trainer (nếu có)
    if (req.getTrainerId() != null) {
        User trainer = new User();
        trainer.setUserId(req.getTrainerId());
        membership.setTrainer(trainer);
    }

    // Ngày bắt đầu & kết thúc
    LocalDate today = LocalDate.now();
    membership.setStartDate(today);
    membership.setEndDate(today.plusDays(pkg.getDuration()));

    // Trạng thái thanh toán
    membership.setPaymentStatus(Membership.PaymentStatus.Unpaid);

    // Lưu
    membershipRepository.save(membership);
}


    public boolean payMembership(PayMembershipRequest req) {
        Optional<Membership> membershipOpt = membershipRepository
                .findByMemberUserIdAndMembershipPackagePackageIdAndPaymentStatus(
                        req.getMemberId(), req.getPackageId(), Membership.PaymentStatus.Unpaid
                );

        if (membershipOpt.isPresent()) {
            Membership membership = membershipOpt.get();
            membership.setPaymentStatus(Membership.PaymentStatus.Processing);
            membershipRepository.save(membership);
            return true;
        } else {
            return false;
        }
    }

    public boolean cancelMembership(PayMembershipRequest req) {
        Optional<Membership> membershipOpt = membershipRepository
                .findByMemberUserIdAndMembershipPackagePackageIdAndPaymentStatus(
                        req.getMemberId(),
                        req.getPackageId(),
                        Membership.PaymentStatus.Paid // hoặc Unpaid tuỳ logic của cậu
                );

        if (membershipOpt.isPresent()) {
            membershipRepository.delete(membershipOpt.get()); // ❌ XOÁ HẲN
            return true;
        } else {
            return false;
        }
    }


    public boolean extendMembership(PayMembershipRequest req) {
        Optional<Membership> membershipOpt = membershipRepository
                .findByMemberUserIdAndMembershipPackagePackageId(req.getMemberId(), req.getPackageId());

        if (membershipOpt.isPresent()) {
            Membership membership = membershipOpt.get();

            MembershipPackage fullPackage = membershipPackageRepository
                    .findById(req.getPackageId())
                    .orElse(null);

            if (fullPackage == null || fullPackage.getDuration() == null) {
                return false; // Không có thông tin về gói
            }

            LocalDate currentEndDate = membership.getEndDate();
            membership.setEndDate(currentEndDate.plusDays(fullPackage.getDuration()));
            membershipRepository.save(membership);
            return true;
        } else {
            return false;
        }
    }


}
