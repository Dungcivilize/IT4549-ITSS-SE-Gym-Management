package BE.ITSS.ITSS.DTO;

public class RegisterMembershipRequest {
    private Long memberId;
    private Long packageId;

    // Getter
    public Long getMemberId() {
        return memberId;
    }

    public Long getPackageId() {
        return packageId;
    }

    // Setter
    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }
}
