package ITSS.Backend.Admin.DTO;

import lombok.Data;

@Data
public class EquipmentDTO {
    private Long equipmentId;
    private String equipmentName;
    private Long quantity;
    private String manufacturer;
    private Long roomId;      
    private Double price;
    private String status;
    private String notes;
}
