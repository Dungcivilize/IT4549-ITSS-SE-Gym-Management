package BE.ITSS.ITSS.Controllers;

import BE.ITSS.ITSS.DTO.*;
import BE.ITSS.ITSS.Models.User;
import BE.ITSS.ITSS.Models.Member;
import BE.ITSS.ITSS.Repositories.UserRepository;
import BE.ITSS.ITSS.Repositories.MemberRepository;
import BE.ITSS.ITSS.Services.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/membership")

public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping("/register")
    public ResponseEntity<String> registerPackage(@RequestBody RegisterMembershipRequest request) {
        membershipService.registerMembership(request);
        return ResponseEntity.ok("Đăng ký gói tập thành công!");
    }

    @PostMapping("/submit-payment-note")
    public ResponseEntity<String> submitPaymentNote(@RequestBody SubmitPaymentNoteRequest request) {
        membershipService.savePaymentNote(request);
        return ResponseEntity.ok("Đã ghi nhận thông tin thanh toán.");
    }

    @GetMapping("/registered/{memberId}")
    public ResponseEntity<List<RegisteredPackageResponse>> getRegisteredPackages(@PathVariable Long memberId) {
        List<RegisteredPackageResponse> packages = membershipService.getRegisteredPackages(memberId);
        return ResponseEntity.ok(packages);
    }

    @PostMapping("/admin/confirm-payment")
    public ResponseEntity<String> confirmPayment(@RequestBody ConfirmPaymentRequest request) {
        membershipService.confirmPayment(request);
        return ResponseEntity.ok("Xác nhận thanh toán thành công.");
    }

    @PostMapping("/request-cancel")
    public ResponseEntity<String> requestCancelPackage(@RequestBody CancelRequest request) {
        membershipService.requestCancelPackage(request);
        return ResponseEntity.ok("Yêu cầu huỷ gói tập đã được ghi nhận.");
    }

    @PostMapping("/admin/confirm-cancel")
    public ResponseEntity<String> confirmCancelPackage(@RequestBody CancelRequest request) {
        membershipService.confirmCancelPackage(request);

        if ("Xác nhận huỷ".equalsIgnoreCase(request.getPaymentStatus())) {
            return ResponseEntity.ok("Gói tập đã được huỷ.");
        } else {
            return ResponseEntity.ok("Gói tập không đủ điều kiện để huỷ.");
        }
    }

    @PostMapping("/renewal")
    public ResponseEntity<String> requestRenewal(@RequestBody RenewalRequest request) {
        membershipService.requestRenewal(request);
        return ResponseEntity.ok("Đã ghi nhận yêu cầu gia hạn. Vui lòng thanh toán.");
    }



}
