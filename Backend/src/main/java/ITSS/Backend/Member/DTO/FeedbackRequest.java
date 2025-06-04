package ITSS.Backend.Member.DTO;

public class FeedbackRequest {
    private Long memberId;
    private String feedbackText;

    // Getters & Setters

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getFeedbackText() {
        return feedbackText;
    }

    public void setFeedbackText(String feedbackText) {
        this.feedbackText = feedbackText;
    }
}
