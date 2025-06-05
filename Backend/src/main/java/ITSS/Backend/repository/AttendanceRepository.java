package ITSS.Backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.Attendance;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query(value = """
    SELECT DATE_FORMAT(checkin_date, '%Y-%m') AS month, COUNT(*) AS total
    FROM Attendance
    WHERE member_id = :memberId
    GROUP BY month
    ORDER BY month
""", nativeQuery = true)
    List<Object[]> getMonthlyAttendanceByMember(@Param("memberId") Long memberId);

    @Query("SELECT a.checkinDate FROM Attendance a WHERE a.member.id = :memberId AND FUNCTION('DATE_FORMAT', a.checkinDate, '%Y-%m') = :month ORDER BY a.checkinDate")
    List<LocalDateTime> findByMemberIdAndMonth(@Param("memberId") Long memberId, @Param("month") String month);

    List<Attendance> findByMember_UserId(Long memberId);
} 