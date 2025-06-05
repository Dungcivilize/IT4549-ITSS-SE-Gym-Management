package ITSS.Backend.Member.Controller;

import ITSS.Backend.Member.DTO.*;
import ITSS.Backend.Member.Service.MemberMembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
        boolean extended = memberMembershipService.extendMembership(req);
        if (extended) {
            return ResponseEntity.ok("Gia hạn gói tập thành công");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không thể gia hạn: gói tập không tồn tại hoặc thiếu thông tin duration");
        }
    }


}
