package com.example.gym.controller;

import com.example.gym.entity.Attendance;
import com.example.gym.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(@RequestParam Long memberId) {
        Attendance saved = attendanceService.checkIn(memberId);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(@RequestParam Long memberId) {
        Attendance updated = attendanceService.checkOut(memberId);
        return ResponseEntity.ok(updated);
    }
}
