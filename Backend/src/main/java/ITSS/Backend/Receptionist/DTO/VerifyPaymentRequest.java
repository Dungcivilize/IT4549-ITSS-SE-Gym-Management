package ITSS.Backend.Receptionist.DTO;

public class VerifyPaymentRequest {
    private Long membershipId;
    private String action; // "APPROVE" hoặc "REJECT"
    private String reason; // Lý do từ chối (optional)

    // Constructors
    public VerifyPaymentRequest() {}

    public VerifyPaymentRequest(Long membershipId, String action, String reason) {
        this.membershipId = membershipId;
        this.action = action;
        this.reason = reason;
    }

    // Getters & Setters
    public Long getMembershipId() {
        return membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
} 