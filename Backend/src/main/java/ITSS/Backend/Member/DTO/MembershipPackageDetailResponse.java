package ITSS.Backend.Member.DTO;

import lombok.Data;

@Data
public class MembershipPackageDetailResponse {
    private Long packageId;
    private String packageName;
    private String packageType;
    private Long duration; // ví dụ: số ngày
    private double price;
    private boolean PT;
}
