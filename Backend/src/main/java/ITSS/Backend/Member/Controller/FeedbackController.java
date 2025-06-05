package ITSS.Backend.Member.Controller;

import ITSS.Backend.entity.Feedback;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.FeedbackRepository;
import ITSS.Backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ITSS.Backend.Member.DTO.FeedbackRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    // 🟢 Create
    @PostMapping
    public ResponseEntity<?> createFeedback(@RequestBody FeedbackRequest request) {
        logger.info("Received feedback request: memberId={}, feedbackText={}",
                request.getMemberId(),
                request.getFeedbackText());

        if (request.getFeedbackText() == null || request.getFeedbackText().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nội dung feedback không được để trống");
        }

        Optional<User> memberOpt = userRepository.findById(request.getMemberId());
        if (!memberOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy thành viên");
        }

        Feedback feedback = new Feedback();
        feedback.setMember(memberOpt.get());
        feedback.setFeedbackText(request.getFeedbackText().trim());
        feedback.setFeedbackDate(LocalDate.now());

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
        List<Feedback> feedbacks = feedbackRepository.findByMemberUserId(memberId);
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
        if (!feedback.getMember().getUserId().equals(memberId)) {
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
        if (!feedback.getMember().getUserId().equals(memberId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xóa feedback này");
        }

        feedbackRepository.delete(feedback);
        return ResponseEntity.ok("Feedback đã được xóa");
    }
}

