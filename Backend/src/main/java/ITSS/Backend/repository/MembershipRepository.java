package ITSS.Backend.repository;

import java.util.List;
import java.util.Optional;

import ITSS.Backend.Member.DTO.TrainerPackageSummaryResponse;
import ITSS.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.Membership;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    @Query("SELECT m FROM Membership m WHERE YEAR(m.startDate) = :year AND MONTH(m.startDate) = :month")
    List<Membership> findByStartDateInMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COUNT(DISTINCT m.member.userId) FROM Membership m WHERE YEAR(m.startDate) = :year AND MONTH(m.startDate) = :month")
    long countDistinctMembersByStartDateInMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COUNT(DISTINCT m.member.userId) FROM Membership m WHERE m.paymentStatus = 'Paid' AND YEAR(m.startDate) = :year AND MONTH(m.startDate) = :month")
    long countDistinctPaidMembersByStartDateInMonth(@Param("year") int year, @Param("month") int month);

    List<Membership> findByPaymentStatus(Membership.PaymentStatus paymentStatus);
} 