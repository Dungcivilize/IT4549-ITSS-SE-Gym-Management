package ITSS.Backend.Member.Service;

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

}
