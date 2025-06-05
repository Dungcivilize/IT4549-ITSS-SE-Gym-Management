// ITSS.Backend.Member.DTO.FeedbackMemberResponse.java
package ITSS.Backend.Member.DTO;

import java.time.LocalDate;

public class FeedbackMemberResponse {
    private Long feedbackId;
    private Long roomId;
    private String roomName;
    private String feedbackText;
    private LocalDate feedbackDate;
    private String userName;

    public FeedbackMemberResponse(Long feedbackId,Long roomId, String roomName, String feedbackText, LocalDate feedbackDate, String userName) {
        this.feedbackId = feedbackId;
        this.roomId = roomId;
        this.roomName = roomName;
        this.feedbackText = feedbackText;
        this.feedbackDate = feedbackDate;
        this.userName = userName;
    }

    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
    }

    // Getters & Setters
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }
    public LocalDate getFeedbackDate() { return feedbackDate; }
    public void setFeedbackDate(LocalDate feedbackDate) { this.feedbackDate = feedbackDate; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
}