package ITSS.Backend.Trainer.Controller;

import ITSS.Backend.Trainer.DTO.TrainerAttendanceDTO;
import ITSS.Backend.Trainer.DTO.TrainerMemberDTO;
import ITSS.Backend.Trainer.DTO.TrainerUpdateProfile;
import ITSS.Backend.Trainer.Service.TrainerService;
import ITSS.Backend.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Lấy thông tin profile trainer
    @GetMapping("/profile/{trainerId}")
    public ResponseEntity<User> getTrainerProfile(@PathVariable Long trainerId) {
        User trainer = trainerService.getTrainerProfile(trainerId);
        return ResponseEntity.ok(trainer);
    }

    // Cập nhật profile trainer
    @PutMapping("/profile/{trainerId}")
    public ResponseEntity<User> updateTrainerProfile(@PathVariable Long trainerId,
                                                     @RequestBody TrainerUpdateProfile updateProfile) {
        User updated = trainerService.updateTrainerProfile(trainerId, updateProfile);
        return ResponseEntity.ok(updated);
    }
}
