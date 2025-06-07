package ITSS.Backend.Admin.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import ITSS.Backend.Admin.DTO.FeedbackDTO;
import ITSS.Backend.entity.Feedback;
import ITSS.Backend.repository.FeedbackRepository;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository repo) {
        this.feedbackRepository = repo;
    }

    public double getAverageRating() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        if (feedbacks.isEmpty()) return 0;
        double sum = feedbacks.stream().mapToInt(Feedback::getRating).sum();
        return sum / feedbacks.size();
    }

    public long getTotalFeedbacks() {
        return feedbackRepository.count();
    }

    public List<FeedbackDTO> getHighlightFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findTop5ByOrderByFeedbackDateDesc();
        return feedbacks.stream().map(fb -> 
            new FeedbackDTO(fb.getFeedbackId(), fb.getFeedbackText(), fb.getFeedbackDate(), fb.getRating(),
                fb.getMember().getFullname() != null ? fb.getMember().getFullname() : fb.getMember().getUserName())
        ).toList();
    }
}