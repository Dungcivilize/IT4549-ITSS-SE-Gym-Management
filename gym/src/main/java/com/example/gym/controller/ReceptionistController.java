package com.example.gym.controller;

import com.example.gym.entity.Receptionist;
import com.example.gym.entity.User;
import com.example.gym.enums.Role;
import com.example.gym.repository.AttendanceRepository;
import com.example.gym.repository.MaintenanceRequestRepository;
import com.example.gym.repository.UserRepository;
import com.example.gym.service.ReceptionistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/receptionists")
@RequiredArgsConstructor
public class ReceptionistController {

    private final ReceptionistService receptionistService;
    private final UserRepository userRepository;

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final AttendanceRepository attendanceRepository;

    @GetMapping
    public List<Receptionist> getAllReceptionists() {
        return receptionistService.getAllReceptionists();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receptionist> getReceptionistById(@PathVariable Long id) {
        return receptionistService.getReceptionistById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Receptionist> getReceptionistByUserId(@PathVariable Long userId) {
        return receptionistService.getReceptionistByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Receptionist createReceptionist(@RequestBody Receptionist receptionist) {
        return receptionistService.createReceptionist(receptionist);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receptionist> updateReceptionist(@PathVariable Long id, @RequestBody Receptionist receptionist) {
        try {
            Receptionist updated = receptionistService.updateReceptionist(id, receptionist);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceptionist(@PathVariable Long id) {
        receptionistService.deleteReceptionist(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/members")
    public ResponseEntity<List<User>> getAllMembers() {
        return ResponseEntity.ok(
                userRepository.findByRole(Role.member)
        );
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        // Đếm số thành viên
        long membersCount = userRepository.countByRole(Role.member);

        // Đếm số yêu cầu bảo trì (bạn cần tạo hoặc inject repository của MaintenanceRequest)
        long maintenanceRequestsCount = maintenanceRequestRepository.count();

        // Đếm số check-in hôm nay (bạn cần tạo hoặc inject repository của Attendance)
        LocalDate today = LocalDate.now();
        long todayCheckIns = attendanceRepository.countByCheckInTimeBetween(
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );

        Map<String, Long> stats = new HashMap<>();
        stats.put("membersCount", membersCount);
        stats.put("maintenanceRequestsCount", maintenanceRequestsCount);
        stats.put("todayCheckIns", todayCheckIns);

        return ResponseEntity.ok(stats);
    }
}
