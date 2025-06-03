package ITSS.Backend.Receptionist.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EquipmentStatisticsWithStatusDTO {
    private Long equipmentId;
    private String roomName;
    private String equipmentName;
    private String status;
    private String notes;
    private Long count;
}
