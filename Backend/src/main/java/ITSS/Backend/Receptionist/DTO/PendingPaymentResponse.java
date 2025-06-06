package ITSS.Backend.Receptionist.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PendingPaymentResponse {
    private Long membershipId;
    private Long memberId;
    private String memberName;
    private Long packageId;
    private String packageName;
    private Long amount;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime paymentDate;
    private String transactionCode;

    // Constructor
    public PendingPaymentResponse(Long membershipId, Long memberId, String memberName, Long packageId,
                                 String packageName, Long amount, LocalDate startDate, LocalDate endDate,
                                 LocalDateTime paymentDate, String transactionCode) {
        this.membershipId = membershipId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.packageId = packageId;
        this.packageName = packageName;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.paymentDate = paymentDate;
        this.transactionCode = transactionCode;
    }

    // Getters & Setters
    public Long getMembershipId() {
        return membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
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
} 