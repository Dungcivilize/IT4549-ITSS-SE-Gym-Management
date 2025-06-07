package ITSS.Backend.Admin.DTO;

import java.time.LocalDate;
import lombok.Data;


@Data
public class FeedbackDTO {
    private Long feedbackId;
    private String feedbackText;
    private LocalDate feedbackDate;
    private Integer rating;
    private String memberName;

    public FeedbackDTO(Long feedbackId, String feedbackText, LocalDate feedbackDate, Integer rating, String memberName) {
        this.feedbackId = feedbackId;
        this.feedbackText = feedbackText;
        this.feedbackDate = feedbackDate;
        this.rating = rating;
        this.memberName = memberName;
    }
}