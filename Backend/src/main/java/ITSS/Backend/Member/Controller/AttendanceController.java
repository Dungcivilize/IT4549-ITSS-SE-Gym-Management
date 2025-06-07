package ITSS.Backend.Member.Controller;

import ITSS.Backend.Member.DTO.AttendanceDateFeedbackResponse;
import ITSS.Backend.Member.DTO.AttendanceMonthlyResponse;
import ITSS.Backend.Member.DTO.PtRemainingResponse;
import ITSS.Backend.Member.Service.AttendanceService;
import ITSS.Backend.entity.Membership;
import ITSS.Backend.repository.AttendanceRepository;
import ITSS.Backend.repository.MembershipRepository;
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
    private final MembershipRepository membershipRepository;

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
    public ResponseEntity<List<AttendanceDateFeedbackResponse>> getAttendanceDatesByMonth(
            @PathVariable Long memberId,
            @RequestParam String month) {
        List<AttendanceDateFeedbackResponse> datesWithFeedback = attendanceService.getAttendanceDatesWithFeedbackByMonth(memberId, month);
        return ResponseEntity.ok(datesWithFeedback);
    }

    @GetMapping("/pt-remaining/{memberId}")
    public ResponseEntity<PtRemainingResponse> getPtRemaining(@PathVariable Long memberId) {
        Membership membership = membershipRepository
                .findTopByMemberUserIdOrderByStartDateDesc(memberId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói tập"));

        int maxPt = membership.getMembershipPackage().getMaxPtMeetingDays();
        int used = attendanceRepository.countByMember_UserIdAndFeedbackIsNotNull(memberId);
        int ptRemaining = Math.max(maxPt - used, 0);

        return ResponseEntity.ok(new PtRemainingResponse(ptRemaining));
    }
}
