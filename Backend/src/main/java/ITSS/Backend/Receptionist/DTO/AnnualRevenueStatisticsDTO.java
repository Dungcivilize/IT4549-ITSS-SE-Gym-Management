package ITSS.Backend.Receptionist.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AnnualRevenueStatisticsDTO {
    private int year;
    private List<Double> monthlyRevenues; // 12 phần tử, mỗi phần tử là revenue của 1 tháng
}
