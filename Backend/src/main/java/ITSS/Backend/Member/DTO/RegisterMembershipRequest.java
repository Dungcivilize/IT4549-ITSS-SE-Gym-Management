package ITSS.Backend.Member.DTO;

import lombok.Data;

@Data
public class RegisterMembershipRequest {
    private Long memberId;
    private Long packageId;
    private Long trainerId; // có thể null
}
