package ITSS.Backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Accepted_bill")
public class AcceptedBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Long billId;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "package_id", nullable = false)
    private Long packageId;

    @Column(nullable = false)
    private Long amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "transaction_code", length = 50)
    private String transactionCode;

    @Column(name = "verified_date")
    private LocalDateTime verifiedDate;

    @Column(name = "reject_reason")
    private String rejectReason;
}
