// ITSS.Backend.Member.DTO.FeedbackMemberResponse.java
package ITSS.Backend.Member.DTO;

import java.time.LocalDate;

public class FeedbackMemberResponse {
    private Long feedbackId;
    private String feedbackText;
    private LocalDate feedbackDate;
    private String userName;
    private Integer rating;

    public FeedbackMemberResponse(Long feedbackId, String feedbackText, LocalDate feedbackDate, String userName, Integer rating) {
        this.feedbackId = feedbackId;
        this.feedbackText = feedbackText;
        this.feedbackDate = feedbackDate;
        this.userName = userName;
        this.rating = rating;
    }

    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}