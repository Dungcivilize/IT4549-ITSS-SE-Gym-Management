package ITSS.Backend.Member.DTO;

import lombok.Data;

@Data
public class TrainerPackageSummaryResponse {
    private Long trainerId;
    private String trainerName;
    private Long packageId;
    private String packageName;
    private Long memberCount;

    public TrainerPackageSummaryResponse(Long trainerId, String trainerName, Long packageId, String packageName, Long memberCount) {
        this.trainerId = trainerId;
        this.trainerName = trainerName;
        this.packageId = packageId;
        this.packageName = packageName;
        this.memberCount = memberCount;
    }
}
