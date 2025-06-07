package ITSS.Backend.Trainer.Controller;

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

import ITSS.Backend.Trainer.DTO.FeedbackRequestDTO;
import ITSS.Backend.Trainer.DTO.TrainerAttendanceDTO;
import ITSS.Backend.Trainer.DTO.TrainerMemberDTO;
import ITSS.Backend.Trainer.Service.TrainerService;

@RestController
@RequestMapping("/api/trainer")
public class TrainerController {

    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
    }

    // Lấy danh sách Member của Trainer
    @GetMapping("/members")
    public List<TrainerMemberDTO> getMembers(@RequestParam Long trainerId) {
        return trainerService.getMembersByTrainer(trainerId);
    }

    // Lấy danh sách checkin của Member
    @GetMapping("/members/{memberId}/attendances")
    public List<TrainerAttendanceDTO> getAttendances(@PathVariable Long memberId) {
        return trainerService.getAttendancesByMember(memberId);
    }

    // Tạo checkin mới cho Member
    @PostMapping("/members/{memberId}/attendances")
    public TrainerAttendanceDTO createAttendance(@PathVariable Long memberId) {
        return trainerService.createAttendance(memberId);
    }

    @PutMapping("/attendance/{attendanceId}/feedback")
    public ResponseEntity<?> updateFeedback(
            @PathVariable Long attendanceId,
            @RequestBody FeedbackRequestDTO dto
    ) {
        try {
            TrainerAttendanceDTO updated = trainerService.updateAttendanceFeedback(attendanceId, dto.getFeedback());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
