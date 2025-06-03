package ITSS.Backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Membership")
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "membership_id")
    private Long membershipId;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;

    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private MembershipPackage membershipPackage;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "payment_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    public enum PaymentStatus {
        Paid, Unpaid, Processing
    }
} 