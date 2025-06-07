package ITSS.Backend.Admin.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import ITSS.Backend.Admin.DTO.FeedbackDTO;
import ITSS.Backend.Admin.Service.FeedbackService;

@RestController
public class AdminFeedbackController {

    private final FeedbackService feedbackService;

    public AdminFeedbackController(FeedbackService service) {
        this.feedbackService = service;
    }

    @GetMapping("/api/feedback/summary")
    public Map<String, Object> getFeedbackSummary() {
        Map<String, Object> response = new HashMap<>();
        response.put("averageRating", feedbackService.getAverageRating());
        response.put("totalFeedbacks", feedbackService.getTotalFeedbacks());
        return response;
    }

    @GetMapping("/api/feedback/highlights")
    public List<FeedbackDTO> getHighlightFeedbacks() {
        return feedbackService.getHighlightFeedbacks();
    }
}