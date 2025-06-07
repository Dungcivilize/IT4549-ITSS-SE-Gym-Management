package ITSS.Backend.Receptionist.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ITSS.Backend.Receptionist.DTO.PendingPaymentResponse;
import ITSS.Backend.Receptionist.DTO.VerifyPaymentRequest;
import ITSS.Backend.entity.AcceptedBill;
import ITSS.Backend.entity.Membership;
import ITSS.Backend.repository.AcceptedBillRepository;
import ITSS.Backend.repository.MembershipPackageRepository;
import ITSS.Backend.repository.MembershipRepository;
import ITSS.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentVerificationService {

    private final AcceptedBillRepository acceptedBillRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final MembershipPackageRepository packageRepository;

    // Lấy danh sách membership chờ verify payment
    public List<PendingPaymentResponse> getPendingPayments() {
        List<Membership> pendingMemberships = membershipRepository.findByPaymentStatus(Membership.PaymentStatus.Processing);
        
        return pendingMemberships.stream().map(membership -> {
            String memberName = membership.getMember().getFullname();
            String packageName = membership.getMembershipPackage().getPackageName();
            
            // Lấy bill mới nhất theo member và package
            List<AcceptedBill> bills = acceptedBillRepository.findByMemberIdAndPackageIdOrderByPaymentDateDesc(
                membership.getMember().getUserId(), 
                membership.getMembershipPackage().getPackageId()
            );
            
            // Tính amount từ package nếu không có trong bill
            Long amount;
            LocalDateTime paymentDate;
            String transactionCode;
            
            if (!bills.isEmpty()) {
                // Lấy bill mới nhất (đầu tiên trong list đã sort)
                AcceptedBill latestBill = bills.get(0);
                amount = latestBill.getAmount();
                paymentDate = latestBill.getPaymentDate();
                transactionCode = latestBill.getTransactionCode();
            } else {
                // Tính amount từ MembershipPackage nếu chưa có AcceptedBill
                double packagePrice = membership.getMembershipPackage().getPrice();
                double discount = membership.getMembershipPackage().getDiscount();
                amount = Math.round(packagePrice * (1 - discount));
                paymentDate = null;
                transactionCode = null;
            }
            
            return new PendingPaymentResponse(
                    membership.getMembershipId(),
                    membership.getMember().getUserId(),
                    memberName,
                    membership.getMembershipPackage().getPackageId(),
                    packageName,
                    amount,
                    membership.getStartDate(),
                    membership.getEndDate(),
                    paymentDate,
                    transactionCode
            );
        }).collect(Collectors.toList());
    }

    // Verify payment
    @Transactional
    public boolean verifyPayment(VerifyPaymentRequest request) {
        Optional<Membership> membershipOpt = membershipRepository.findById(request.getMembershipId());
        
        if (membershipOpt.isEmpty()) {
            return false;
        }

        Membership membership = membershipOpt.get();
        
        // Kiểm tra membership đang ở trạng thái Processing
        if (membership.getPaymentStatus() != Membership.PaymentStatus.Processing) {
            return false;
        }

        // Tìm bill mới nhất tương ứng để cập nhật
        List<AcceptedBill> bills = acceptedBillRepository.findByMemberIdAndPackageIdOrderByPaymentDateDesc(
            membership.getMember().getUserId(),
            membership.getMembershipPackage().getPackageId()
        );

        if ("APPROVE".equals(request.getAction())) {
            // Approve payment
            membership.setPaymentStatus(Membership.PaymentStatus.Paid);
            
            // Đếm số lần thanh toán thành công trước đó
            Long previousPayments = acceptedBillRepository.countVerifiedBillsByMemberAndPackage(
                membership.getMember().getUserId(),
                membership.getMembershipPackage().getPackageId()
            );
            
            if (previousPayments > 0) {
                // Đây là lần gia hạn
                Long duration = membership.getMembershipPackage().getDuration();
                if (duration != null) {
                    // Cộng thêm thời gian vào endDate
                    membership.setEndDate(membership.getEndDate().plusDays(duration));
                    System.out.println("🎯 [EXTEND APPROVED] Gia hạn thêm " + duration + " ngày");
                }
            }
            
            if (!bills.isEmpty()) {
                AcceptedBill bill = bills.get(0);
                bill.setVerifiedDate(LocalDateTime.now());
                bill.setRejectReason(null);
                acceptedBillRepository.save(bill);
            }
        } else {
            // Reject payment
            membership.setPaymentStatus(Membership.PaymentStatus.Unpaid);
            
            if (!bills.isEmpty()) {
                AcceptedBill bill = bills.get(0);
                bill.setVerifiedDate(LocalDateTime.now());
                bill.setRejectReason(request.getReason());
                acceptedBillRepository.save(bill);
            }
        }
        
        membershipRepository.save(membership);
        return true;
    }
} 