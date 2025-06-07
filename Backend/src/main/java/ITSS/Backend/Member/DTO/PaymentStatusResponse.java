package ITSS.Backend.Member.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PaymentStatusResponse {
    private Long membershipId;
    private String packageName;
    private String paymentStatus;
    private Long amount;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime paymentDate;
    private String transactionCode;
    private String rejectReason;
    private LocalDateTime verifiedDate;

    // Constructor
    public PaymentStatusResponse(Long membershipId, String packageName, String paymentStatus, 
                               Long amount, LocalDate startDate, LocalDate endDate,
                               LocalDateTime paymentDate, String transactionCode, 
                               String rejectReason, LocalDateTime verifiedDate) {
        this.membershipId = membershipId;
        this.packageName = packageName;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.paymentDate = paymentDate;
        this.transactionCode = transactionCode;
        this.rejectReason = rejectReason;
        this.verifiedDate = verifiedDate;
    }

    // Getters & Setters
    public Long getMembershipId() {
        return membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }

    public String getRejectReason() {
        return rejectReason;
    }

    public void setRejectReason(String rejectReason) {
        this.rejectReason = rejectReason;
    }

    public LocalDateTime getVerifiedDate() {
        return verifiedDate;
    }

    public void setVerifiedDate(LocalDateTime verifiedDate) {
        this.verifiedDate = verifiedDate;
    }
} 