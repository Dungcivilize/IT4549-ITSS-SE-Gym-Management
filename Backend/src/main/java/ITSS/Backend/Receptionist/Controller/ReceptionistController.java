package ITSS.Backend.Receptionist.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ITSS.Backend.Receptionist.DTO.AnnualRevenueStatisticsDTO;
import ITSS.Backend.Receptionist.DTO.EquipmentStatisticsWithStatusDTO;
import ITSS.Backend.Receptionist.DTO.EquipmentUpdateDTO;
import ITSS.Backend.Receptionist.DTO.MembershipApprovalDTO;
import ITSS.Backend.Receptionist.DTO.PendingPaymentResponse;
import ITSS.Backend.Receptionist.DTO.ReceptionistProfileDTO;
import ITSS.Backend.Receptionist.DTO.ReceptionistProfileUpdateDTO;
import ITSS.Backend.Receptionist.DTO.RevenueStatisticsDTO;
import ITSS.Backend.Receptionist.DTO.VerifyPaymentRequest;
import ITSS.Backend.Receptionist.Service.PaymentVerificationService;
import ITSS.Backend.Receptionist.Service.ReceptionistService;
import ITSS.Backend.entity.Equipment;
import ITSS.Backend.entity.User;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/receptionist")
@RequiredArgsConstructor
public class ReceptionistController {

    private final ReceptionistService receptionistService;
    private final PaymentVerificationService paymentVerificationService;

    @GetMapping("/revenue")
    public ResponseEntity<RevenueStatisticsDTO> getMonthlyRevenue(
            @RequestParam int year,
            @RequestParam int month) {
        RevenueStatisticsDTO revenue = receptionistService.getMonthlyRevenueStatistics(year, month);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/revenue/annual")
    public ResponseEntity<AnnualRevenueStatisticsDTO> getAnnualRevenue(@RequestParam int year) {
        return ResponseEntity.ok(receptionistService.getAnnualRevenue(year));
    }

    @GetMapping("/equipment-statistics")
    public ResponseEntity<List<EquipmentStatisticsWithStatusDTO>> getEquipmentStatisticsWithStatus() {
        return ResponseEntity.ok(receptionistService.getEquipmentStatisticsWithStatus());
    }

    @PutMapping("/equipment/update-notes-status")
    public ResponseEntity<?> updateEquipment(@RequestBody EquipmentUpdateDTO dto) {
        try {
            Equipment updatedEquipment = receptionistService.updateEquipmentNotesAndStatus(dto);
            return ResponseEntity.ok(updatedEquipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getReceptionistProfile(@RequestParam String username) {
        try {
            ReceptionistProfileDTO profile = receptionistService.getReceptionistProfileByUsername(username);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile/{username}")
    public ResponseEntity<?> updateReceptionistProfile(
            @PathVariable String username,
            @RequestBody ReceptionistProfileUpdateDTO dto
    ) {
        try {
            User user = receptionistService.updateReceptionistProfile(username, dto);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<MembershipApprovalDTO>> getPendingMemberships() {
        return ResponseEntity.ok(receptionistService.getPendingMembershipApprovals());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<String> approveMembership(@PathVariable Long id) {
        try {
            receptionistService.approveMembership(id);
            return ResponseEntity.ok("Phê duyệt thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 🆕 Payment Verification Endpoints
    @GetMapping("/pending-payments")
    public ResponseEntity<List<PendingPaymentResponse>> getPendingPayments() {
        List<PendingPaymentResponse> pendingPayments = paymentVerificationService.getPendingPayments();
        return ResponseEntity.ok(pendingPayments);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            boolean success = paymentVerificationService.verifyPayment(request);
            if (success) {
                String action = "APPROVE".equals(request.getAction()) ? "duyệt" : "từ chối";
                return ResponseEntity.ok("Đã " + action + " thanh toán thành công!");
            } else {
                return ResponseEntity.badRequest().body("Không thể xử lý thanh toán. Kiểm tra lại thông tin.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
