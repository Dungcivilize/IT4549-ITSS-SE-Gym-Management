package BE.ITSS.ITSS.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import BE.ITSS.ITSS.Models.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT f FROM Feedback f WHERE f.member.member_id = :memberId")
    List<Feedback> findByMemberId(Long memberId);
}

