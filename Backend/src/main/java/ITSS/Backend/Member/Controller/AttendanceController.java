package ITSS.Backend.Member.Controller;

import ITSS.Backend.Member.DTO.AttendanceMonthlyResponse;
import ITSS.Backend.Member.Service.AttendanceService;
import ITSS.Backend.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;
    private final AttendanceRepository attendanceRepository;

    @GetMapping("/monthly/{memberId}")
    public ResponseEntity<List<AttendanceMonthlyResponse>> getMonthlyAttendance(@PathVariable Long memberId) {
        List<Object[]> rawResult = attendanceRepository.getMonthlyAttendanceByMember(memberId);
        List<AttendanceMonthlyResponse> response = rawResult.stream()
                .map(row -> new AttendanceMonthlyResponse(String.valueOf(row[0]), ((Number) row[1]).intValue()))
                .toList();
        return ResponseEntity.ok(response);
    }

    // === Phần thêm mới đây ===
    @GetMapping("/dates/{memberId}")
    public ResponseEntity<List<String>> getAttendanceDatesByMonth(
            @PathVariable Long memberId,
            @RequestParam String month) {
        List<String> dates = attendanceService.getAttendanceDatesByMonth(memberId, month);
        return ResponseEntity.ok(dates);
    }
}
