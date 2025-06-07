package ITSS.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ITSS.Backend.Admin.DTO.RevenueDto;

import java.util.List;

import ITSS.Backend.Member.DTO.TransactionHistoryResponse;
import ITSS.Backend.entity.AcceptedBill;

public interface AcceptedBillRepository extends JpaRepository<AcceptedBill, Long> {

    @Query("SELECT new ITSS.Backend.Member.DTO.TransactionHistoryResponse(p.packageName, b.amount, b.paymentDate) " +
            "FROM AcceptedBill b " +
            "JOIN MembershipPackage p ON p.packageId = b.packageId " +
            "WHERE b.memberId = :memberId AND b.verifiedDate IS NOT NULL " +
            "ORDER BY b.paymentDate DESC")
    List<TransactionHistoryResponse> getHistoryByMemberId(@Param("memberId") Long memberId);

    @Query(value = "SELECT YEAR(payment_date) AS year, MONTH(payment_date) AS month, SUM(amount) AS totalAmount " +
               "FROM accepted_bill " +
               "WHERE YEAR(payment_date) = :year " +
               "GROUP BY YEAR(payment_date), MONTH(payment_date)", nativeQuery = true)
    List<Object[]> getMonthlyRevenueByYear(@Param("year") int year);

    @Query("SELECT SUM(b.amount) FROM AcceptedBill b WHERE YEAR(b.paymentDate) = :year AND MONTH(b.paymentDate) = :month")
    Long getTotalAmountByYearAndMonth(@Param("year") int year, @Param("month") int month);

    // Lấy bill mới nhất theo member và package
    @Query("SELECT b FROM AcceptedBill b WHERE b.memberId = :memberId AND b.packageId = :packageId ORDER BY b.paymentDate DESC")
    List<AcceptedBill> findByMemberIdAndPackageIdOrderByPaymentDateDesc(@Param("memberId") Long memberId, @Param("packageId") Long packageId);

    // Đếm số lần thanh toán thành công (verified) của member cho package
    @Query("SELECT COUNT(b) FROM AcceptedBill b WHERE b.memberId = :memberId AND b.packageId = :packageId AND b.verifiedDate IS NOT NULL")
    Long countVerifiedBillsByMemberAndPackage(@Param("memberId") Long memberId, @Param("packageId") Long packageId);

}
