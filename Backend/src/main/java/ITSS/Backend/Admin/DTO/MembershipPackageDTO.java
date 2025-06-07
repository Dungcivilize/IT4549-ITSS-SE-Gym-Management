package ITSS.Backend.Admin.DTO;
import java.util.List;
import lombok.Data;

@Data
public class MembershipPackageDTO {
    private Long packageId;
    private String packageName;
    private Long duration;
    private Integer maxPtMeetingDays;
    private Long price;
    private Boolean PT;
    private Double discount;
    private List<Long> trainerIds;
}

