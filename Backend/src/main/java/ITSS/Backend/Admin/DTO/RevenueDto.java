package ITSS.Backend.Admin.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueDto {
    private int year;
    private int month;
    private Long totalAmount;
}