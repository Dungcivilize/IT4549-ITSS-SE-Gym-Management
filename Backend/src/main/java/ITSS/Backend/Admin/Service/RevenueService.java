package ITSS.Backend.Admin.Service;

import ITSS.Backend.Admin.DTO.RevenueDto;
import ITSS.Backend.repository.AcceptedBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RevenueService {

    @Autowired
    private AcceptedBillRepository acceptedBillRepository;

    // Thêm method mới nhận year làm tham số
    public List<RevenueDto> getMonthlyRevenue(int year) {
    List<Object[]> results = acceptedBillRepository.getMonthlyRevenueByYear(year);
    List<RevenueDto> dtos = new ArrayList<>();

    for (Object[] row : results) {
        int resultYear = ((Number) row[0]).intValue();
        int month = ((Number) row[1]).intValue();
        Long totalAmount = ((Number) row[2]).longValue();
        dtos.add(new RevenueDto(resultYear, month, totalAmount));
    }

    return dtos;
}

}