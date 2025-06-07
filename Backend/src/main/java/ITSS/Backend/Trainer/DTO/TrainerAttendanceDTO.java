package ITSS.Backend.Trainer.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerAttendanceDTO {
    private Long attendanceId;
    private LocalDateTime checkinDate;
    private String feedback;
    private int ptMeetingDaysLeft;
    private int ptMeetingDaysUsed;
}
