package ITSS.Backend.Member.Service;

import ITSS.Backend.Member.DTO.AttendanceDateFeedbackResponse;
import ITSS.Backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<String> getAttendanceDatesByMonth(Long memberId, String month) {
        List<LocalDateTime> dates = attendanceRepository.findByMemberIdAndMonth(memberId, month);
        return dates.stream()
                .map(dt -> dt.toLocalDate().toString()) // chỉ lấy yyyy-MM-dd
                .collect(Collectors.toList());
    }

    public List<AttendanceDateFeedbackResponse> getAttendanceDatesWithFeedbackByMonth(Long memberId, String month) {
        List<Object[]> rawResult = attendanceRepository.findDatesAndFeedbackByMemberIdAndMonth(memberId, month);
        return rawResult.stream()
                .map(row -> new AttendanceDateFeedbackResponse(
                        row[0].toString(),
                        (String) row[1]
                ))
                .collect(Collectors.toList());
    }

}
