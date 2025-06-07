package ITSS.Backend.Member.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ITSS.Backend.Member.DTO.CurrentMembershipAdminResponse;
import ITSS.Backend.Member.DTO.CurrentMembershipResponse;
import ITSS.Backend.Member.DTO.PayMembershipRequest;
import ITSS.Backend.Member.DTO.PaymentStatusResponse;
import ITSS.Backend.Member.DTO.RegisterMembershipRequest;
import ITSS.Backend.Member.DTO.TrainerPackageSummaryResponse;
import ITSS.Backend.Member.DTO.TransactionHistoryResponse;
import ITSS.Backend.Member.Service.MemberMembershipService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MemberMembershipService memberMembershipService;

    @GetMapping("/current/{userId}")
    public ResponseEntity<?> getCurrentMembership(@PathVariable Long userId) {
        Optional<CurrentMembershipResponse> dtoOpt = memberMembershipService.getCurrentMembership(userId);
        return dtoOpt
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/current")
    public ResponseEntity<List<CurrentMembershipAdminResponse>> getAllCurrentMemberships() {
        return ResponseEntity.ok(memberMembershipService.getAllCurrentMemberships());
    }

    @GetMapping("/trainer-summary")
    public ResponseEntity<List<TrainerPackageSummaryResponse>> getTrainerSummaries() {
        return ResponseEntity.ok(memberMembershipService.getTrainerPackageSummaries());
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterMembershipRequest req) {
        memberMembershipService.registerMembership(req);
        return ResponseEntity.ok("Đăng ký gói tập thành công!");
    }

    @PostMapping("/pay")
    public ResponseEntity<?> payMembership(@RequestBody PayMembershipRequest req) {
        boolean updated = memberMembershipService.payMembership(req);
        if (updated) {
            return ResponseEntity.ok("Bạn đã thanh toán thành công, vui lòng đợi xác nhận");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bản ghi phù hợp");
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelMembership(@RequestBody PayMembershipRequest req) {
        boolean updated = memberMembershipService.cancelMembership(req);
        if (updated) {
            return ResponseEntity.ok("Đã huỷ gói tập");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bản ghi phù hợp để huỷ");
        }   
    }

    @PostMapping("/extend")
    public ResponseEntity<?> extendMembership(@RequestBody PayMembershipRequest req) {
        try {
            memberMembershipService.extendMembership(req);
            return ResponseEntity.ok("Gia hạn gói tập thành công, vui lòng đợi xác nhận");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi hệ thống khi gia hạn gói tập: " + e.getMessage());
        }
    }

    @GetMapping("/history/{memberId}")
    public ResponseEntity<List<TransactionHistoryResponse>> getTransactionHistory(@PathVariable Long memberId) {
        List<TransactionHistoryResponse> history = memberMembershipService.getTransactionHistory(memberId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/payment-status/{memberId}")
    public ResponseEntity<List<PaymentStatusResponse>> getPaymentStatus(@PathVariable Long memberId) {
        List<PaymentStatusResponse> paymentStatus = memberMembershipService.getPaymentStatus(memberId);
        return ResponseEntity.ok(paymentStatus);
    }



}
