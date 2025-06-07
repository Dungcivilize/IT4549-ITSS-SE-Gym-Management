package ITSS.Backend.DTO.Admin;
import java.util.List;
import lombok.Data;

@Data
public class MembershipPackageDTO {
    private Long packageId;
    private String packageName;
    private Long duration;
    private Long price;
    private String packageType;
    private Boolean PT;
    private List<Long> trainerIds;
}

