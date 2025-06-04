package ITSS.Backend.Receptionist.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipApprovalDTO {
    private Long membershipId;
    private Long memberId;
    private String memberName;
    private String packageName;
    private String status;
    private LocalDate startDate;
}