package ITSS.Backend.Member.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttendanceDateFeedbackResponse {
    private String date;    // yyyy-MM-dd
    private String feedback;
}
