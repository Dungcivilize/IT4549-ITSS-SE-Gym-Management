package com.example.gym.repository;

import com.example.gym.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findTopByMemberIdAndCheckOutTimeIsNullOrderByCheckInTimeDesc(Long memberId);

    long countByCheckInTimeBetween(LocalDateTime start, LocalDateTime end);
}
