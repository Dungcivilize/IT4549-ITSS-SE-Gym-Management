package ITSS.Backend.Receptionist.Controller;

import ITSS.Backend.Receptionist.DTO.AnnualRevenueStatisticsDTO;
import ITSS.Backend.Receptionist.DTO.EquipmentStatisticsWithStatusDTO;
import ITSS.Backend.Receptionist.DTO.EquipmentUpdateDTO;
import ITSS.Backend.Receptionist.DTO.RevenueStatisticsDTO;
import ITSS.Backend.Receptionist.Service.ReceptionistService;
import ITSS.Backend.entity.Equipment;
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


}
