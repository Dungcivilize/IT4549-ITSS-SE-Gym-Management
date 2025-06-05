package ITSS.Backend.Member.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class TransactionHistoryResponse {
    private String packageName;
    private Long amount;
    private LocalDateTime paymentDate;
}
