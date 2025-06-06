package ITSS.Backend.repository;

import ITSS.Backend.Member.DTO.TransactionHistoryResponse;
import ITSS.Backend.entity.AcceptedBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AcceptedBillRepository extends JpaRepository<AcceptedBill, Long> {

    @Query("SELECT new ITSS.Backend.Member.DTO.TransactionHistoryResponse(p.packageName, b.amount, b.paymentDate) " +
            "FROM AcceptedBill b " +
            "JOIN MembershipPackage p ON p.packageId = b.packageId " +
            "WHERE b.memberId = :memberId " +
            "ORDER BY b.paymentDate DESC")
    List<TransactionHistoryResponse> getHistoryByMemberId(@Param("memberId") Long memberId);

    @Query("SELECT SUM(b.amount) FROM AcceptedBill b WHERE YEAR(b.paymentDate) = :year AND MONTH(b.paymentDate) = :month")
    Long getTotalAmountByYearAndMonth(@Param("year") int year, @Param("month") int month);
}
