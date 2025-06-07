package ITSS.Backend.Admin.Service;

import java.util.Map;
import java.util.HashMap;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ITSS.Backend.repository.MembershipRepository;

@Service
public class AdminMembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    public Map<Integer, Double> getMonthlyRevenue(int year) {
        List<Object[]> results = membershipRepository.getMonthlyRevenue(year);
        Map<Integer, Double> revenueMap = new HashMap<>();

        // Khởi tạo tất cả tháng = 0
        for (int i = 1; i <= 12; i++) {
            revenueMap.put(i, 0.0);
        }

        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            Double total = (Double) row[1];
            revenueMap.put(month, total);
        }

        return revenueMap;
    }
}
