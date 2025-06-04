package ITSS.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.Membership;
import java.util.List;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    @Query("SELECT MONTH(m.startDate) as month, SUM(m.membershipPackage.price) as total " +
           "FROM Membership m " +
           "WHERE m.paymentStatus = ITSS.Backend.entity.Membership.PaymentStatus.Paid " +
           "AND YEAR(m.startDate) = :year " +
           "GROUP BY MONTH(m.startDate)")
    List<Object[]> getMonthlyRevenue(@Param("year") int year);
} 