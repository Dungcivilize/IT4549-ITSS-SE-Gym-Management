package BE.ITSS.ITSS.Services;

import BE.ITSS.ITSS.DTO.PromotionResponse;
import BE.ITSS.ITSS.Repositories.PromotionRepository;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    public List<PromotionResponse> getActivePromotions() {
        Date today = new Date(System.currentTimeMillis());
        return promotionRepository.findValidPromotions(today)
                .stream()
                .map(PromotionResponse::new)
                .collect(Collectors.toList());
    }
}

