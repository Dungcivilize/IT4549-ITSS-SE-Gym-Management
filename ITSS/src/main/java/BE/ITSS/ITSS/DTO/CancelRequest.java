package BE.ITSS.ITSS.DTO;

public class CancelRequest {
    private Long memberId;
    private Long packageId;
    private String cancelReason;     // Lý do người dùng gửi yêu cầu huỷ
    private String paymentStatus;    // Trạng thái admin xác nhận: "Cancelled" hoặc "Paid"

    // Getter & Setter
    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
