package BE.ITSS.ITSS.Repositories;

import BE.ITSS.ITSS.Models.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    @Query("SELECT m FROM Member m WHERE m.user.user_id = :userId")
    Optional<Member> findByUserId(@Param("userId") Long userId);

    @Query("SELECT m.member_id FROM Member m WHERE m.user.user_id = :userId")
    Long findMemberIdByUserId(@Param("userId") Long userId);

}
