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
} 