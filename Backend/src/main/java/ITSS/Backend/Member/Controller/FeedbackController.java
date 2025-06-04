package ITSS.Backend.Member.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import ITSS.Backend.Member.DTO.FeedbackMemberResponse;
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

import ITSS.Backend.Member.DTO.FeedbackRequest;
import ITSS.Backend.Member.DTO.FeedbackRoomResponse;
import ITSS.Backend.entity.Feedback;
import ITSS.Backend.entity.Room;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.FeedbackRepository;
import ITSS.Backend.repository.RoomRepository;
import ITSS.Backend.repository.UserRepository;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoomRepository roomRepository;

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

        Optional<Room> roomOpt = roomRepository.findById(request.getRoomId());
        if (!roomOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy phòng");
        }

        Feedback feedback = new Feedback();
        feedback.setMember(memberOpt.get());
        feedback.setFeedbackText(request.getFeedbackText().trim());
        feedback.setRoom(roomOpt.get());
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
        List<FeedbackMemberResponse> response = feedbacks.stream()
                .map(fb -> new FeedbackMemberResponse(
                        fb.getRoom().getRoomId(),
                        fb.getRoom().getRoomName(),
                        fb.getFeedbackText(),
                        fb.getFeedbackDate(),
                        fb.getMember().getUserName()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // 🔵 Read tất cả feedback của 1 room
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getFeedbacksByRoom(@PathVariable Long roomId) {
        List<Feedback> feedbacks = feedbackRepository.findByRoomRoomId(roomId);
        List<FeedbackRoomResponse> response = feedbacks.stream()
                .map(feedback -> new FeedbackRoomResponse(
                        feedback.getFeedbackId(),
                        feedback.getMember().getUserName(),
                        feedback.getFeedbackText(),
                        feedback.getFeedbackDate()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
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

