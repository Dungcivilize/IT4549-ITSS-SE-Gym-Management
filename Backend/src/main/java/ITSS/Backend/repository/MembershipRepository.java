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

    @Query("SELECT m FROM Membership m WHERE m.member.id = :userId AND CURRENT_DATE BETWEEN m.startDate AND m.endDate")
    Optional<Membership> findCurrentMembershipByUserId(@Param("userId") Long userId);

    @Query("SELECT m FROM Membership m WHERE CURRENT_DATE BETWEEN m.startDate AND m.endDate")
    List<Membership> findAllCurrentMemberships();

    @Query("""
        SELECT new ITSS.Backend.Member.DTO.TrainerPackageSummaryResponse(
            t.userId, t.fullname, p.packageId, p.packageName, COUNT(m)
        )
        FROM MembershipPackage p
        JOIN p.trainers t
        LEFT JOIN Membership m ON m.trainer.userId = t.userId AND m.membershipPackage.packageId = p.packageId
        GROUP BY t.userId, t.fullname, p.packageId, p.packageName
    """)
    List<TrainerPackageSummaryResponse> findTrainerPackageSummaries();

    Optional<Membership> findByMemberUserIdAndMembershipPackagePackageIdAndPaymentStatus(
            Long memberId, Long packageId, Membership.PaymentStatus status
    );

    Optional<Membership> findByMemberUserIdAndMembershipPackagePackageId(Long memberId, Long packageId);

    long countByTrainerAndPaymentStatus(User trainer, Membership.PaymentStatus status);

    boolean existsByMember_UserIdAndPaymentStatusIn(Long userId, List<Membership.PaymentStatus> statuses);

    List<Membership> findByTrainerUserId(Long trainerId);

    // ✅ Thêm các method mới cần thiết cho thống kê theo tháng

    @Query("SELECT m FROM Membership m WHERE YEAR(m.startDate) = :year AND MONTH(m.startDate) = :month")
    List<Membership> findByStartDateInMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COUNT(DISTINCT m.member.userId) FROM Membership m WHERE YEAR(m.startDate) = :year AND MONTH(m.startDate) = :month")
    long countDistinctMembersByStartDateInMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT COUNT(DISTINCT m.member.userId) FROM Membership m WHERE YEAR(m.startDate) = :year AND MONTH(m.startDate) = :month AND m.paymentStatus = 'Paid'")
    long countDistinctPaidMembersByStartDateInMonth(@Param("year") int year, @Param("month") int month);

    List<Membership> findByPaymentStatus(Membership.PaymentStatus paymentStatus);

    @Query("""
    SELECT MONTH(m.startDate) as month, SUM(p.price) as revenue
    FROM Membership m
    JOIN m.membershipPackage p
    WHERE YEAR(m.startDate) = :year AND m.paymentStatus = 'Paid'
    GROUP BY MONTH(m.startDate)
    ORDER BY MONTH(m.startDate)
""")
    List<Object[]> getMonthlyRevenue(@Param("year") int year);

}
