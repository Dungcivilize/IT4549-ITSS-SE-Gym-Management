package ITSS.Backend.Member.DTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CurrentMembershipResponse {
    private Long membershipId;
    private String packageName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String paymentStatus;
    private Long packageId; // ✅ thêm dòng này
    private Long ptMeetingDaysLeft;
    private Long price; // hoặc Integer tùy backend

}
