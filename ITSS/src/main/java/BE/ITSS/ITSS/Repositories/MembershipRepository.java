package BE.ITSS.ITSS.Repositories;

import BE.ITSS.ITSS.Models.Membership;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findByMemberIdAndPackageId(Long memberId, Long packageId);

    List<Membership> findByMemberId(Long memberId);

    // Trả về danh sách tất cả các lần đăng ký gói đó của member



}
