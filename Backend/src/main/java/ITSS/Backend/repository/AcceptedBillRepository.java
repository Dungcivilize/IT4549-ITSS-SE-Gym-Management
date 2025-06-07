package ITSS.Backend.repository;

import ITSS.Backend.Member.DTO.TransactionHistoryResponse;
import ITSS.Backend.entity.AcceptedBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ITSS.Backend.Admin.DTO.RevenueDto;

import java.util.List;

public interface AcceptedBillRepository extends JpaRepository<AcceptedBill, Long> {

    @Query("SELECT new ITSS.Backend.Member.DTO.TransactionHistoryResponse(p.packageName, b.amount, b.paymentDate) " +
            "FROM AcceptedBill b " +
            "JOIN MembershipPackage p ON p.packageId = b.packageId " +
            "WHERE b.memberId = :memberId " +
            "ORDER BY b.paymentDate DESC")
    List<TransactionHistoryResponse> getHistoryByMemberId(@Param("memberId") Long memberId);

    @Query(value = "SELECT YEAR(payment_date) AS year, MONTH(payment_date) AS month, SUM(amount) AS totalAmount " +
               "FROM accepted_bill " +
               "WHERE YEAR(payment_date) = :year " +
               "GROUP BY YEAR(payment_date), MONTH(payment_date)", nativeQuery = true)
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

}
