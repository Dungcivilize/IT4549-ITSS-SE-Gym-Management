package ITSS.Backend.Member.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberAttendanceDTO {
    private Long attendanceId;
    private LocalDateTime checkinDate;
}
