package BE.ITSS.ITSS.Controllers;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import BE.ITSS.ITSS.DTO.FeedbackRequest;
import BE.ITSS.ITSS.Models.Feedback;
import BE.ITSS.ITSS.Models.Member;
import BE.ITSS.ITSS.Repositories.FeedbackRepository;
import BE.ITSS.ITSS.Repositories.MemberRepository;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private MemberRepository memberRepository;

    // 🟢 Create
    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody FeedbackRequest request) {
        logger.info("Received feedback request: memberId={}, feedbackText={}", 
            request.getMemberId(), 
            request.getFeedbackText());

        if (request.getFeedbackText() == null || request.getFeedbackText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nội dung feedback không được để trống");
        }

        Optional<Member> memberOpt = memberRepository.findById(request.getMemberId());
        if (!memberOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Member không tồn tại");
        }

        Feedback feedback = new Feedback();
        feedback.setMember(memberOpt.get());
        feedback.setFeedbackText(request.getFeedbackText().trim());
        feedback.setFeedbackDate(new Date(System.currentTimeMillis()));

        try {
            feedbackRepository.save(feedback);
            return ResponseEntity.ok("Feedback đã được tạo");
        } catch (Exception e) {
            logger.error("Error saving feedback: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi khi lưu feedback: " + e.getMessage());
        }
    }

    // 🔵 Read tất cả feedback của 1 member
    @GetMapping("/member/{memberId}")
    public ResponseEntity<?> getFeedbacksByMember(@PathVariable Long memberId) {
        List<Feedback> feedbacks = feedbackRepository.findByMemberId(memberId);
        return ResponseEntity.ok(feedbacks);
    }

    // 🟡 Update feedback của member
    @PutMapping("/{feedbackId}/member/{memberId}")
    public ResponseEntity<?> updateFeedback(
            @PathVariable Long feedbackId,
            @PathVariable Long memberId,
            @RequestBody FeedbackRequest request
    ) {
        if (request.getFeedbackText() == null || request.getFeedbackText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nội dung feedback không được để trống");
        }

        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (!feedbackOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback không tồn tại");
        }

        Feedback feedback = feedbackOpt.get();
        if (!feedback.getMember().getMember_id().equals(memberId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền sửa feedback này");
        }

        feedback.setFeedbackText(request.getFeedbackText().trim());
        feedbackRepository.save(feedback);

        return ResponseEntity.ok("Feedback đã được cập nhật");
    }

    // 🔴 Delete feedback
    @DeleteMapping("/{feedbackId}/member/{memberId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long feedbackId, @PathVariable Long memberId) {
        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (!feedbackOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Feedback không tồn tại");
        }

        Feedback feedback = feedbackOpt.get();
        if (!feedback.getMember().getMember_id().equals(memberId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xóa feedback này");
        }

        feedbackRepository.delete(feedback);
        return ResponseEntity.ok("Feedback đã được xóa");
    }
}

