package ITSS.Backend.Member.DTO;

import lombok.Data;

@Data
public class PayMembershipRequest {
    private Long memberId;
    private Long packageId;
}
