package ITSS.Backend.Member.DTO;

import java.time.LocalDate;

public class FeedbackRoomResponse {
    private Long feedbackId;
    private String userName;
    private String feedbackText;
    private LocalDate feedbackDate;

    public FeedbackRoomResponse(Long feedbackId,String userName, String feedbackText,LocalDate feedbackDate) {
        this.feedbackId = feedbackId;
        this.userName = userName;
        this.feedbackText = feedbackText;
        this.feedbackDate = feedbackDate;
    }

    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }

    public LocalDate getFeedbackDate() {
        return feedbackDate;
    }

    public void setFeedbackDate(LocalDate feedbackDate) {
        this.feedbackDate = feedbackDate;
    }
}
