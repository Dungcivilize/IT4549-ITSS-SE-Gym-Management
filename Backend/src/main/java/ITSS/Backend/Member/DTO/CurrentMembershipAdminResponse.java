package ITSS.Backend.Member.DTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CurrentMembershipAdminResponse {
    private Long membershipId;
    private String memberName;
    private String packageName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String paymentStatus;
}
