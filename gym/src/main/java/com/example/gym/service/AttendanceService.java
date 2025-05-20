package com.example.gym.service;

import com.example.gym.entity.Attendance;
import com.example.gym.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public Attendance checkIn(Long memberId) {
        Attendance attendance = Attendance.builder()
                .memberId(memberId)
                .checkInTime(LocalDateTime.now())
                .checkOutTime(null)
                .build();
        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(Long memberId) {
        Optional<Attendance> optional = attendanceRepository
                .findTopByMemberIdAndCheckOutTimeIsNullOrderByCheckInTimeDesc(memberId);

        if (optional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lần check-in chưa check-out.");
        }

        Attendance attendance = optional.get();
        attendance.setCheckOutTime(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }
}
