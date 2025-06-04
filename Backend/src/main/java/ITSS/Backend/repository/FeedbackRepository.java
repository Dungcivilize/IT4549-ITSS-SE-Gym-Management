package ITSS.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByMemberUserId(Long memberId);

    List<Feedback> findByRoomRoomId(Long roomId);
}