package ITSS.Backend.Receptionist.Controller;

import ITSS.Backend.Receptionist.DTO.*;
import ITSS.Backend.Receptionist.Service.ReceptionistService;
import ITSS.Backend.entity.Equipment;
import ITSS.Backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receptionist")
@RequiredArgsConstructor
public class ReceptionistController {

    private final ReceptionistService receptionistService;

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
}
