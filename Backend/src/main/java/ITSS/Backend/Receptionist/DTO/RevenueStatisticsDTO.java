package ITSS.Backend.Receptionist.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueStatisticsDTO {
    private int month;
    private int year;
    private long totalMembers;
    private long paidMembers;
    private double totalRevenue;
    private Map<String, Long> membershipPackageCounts;
}
