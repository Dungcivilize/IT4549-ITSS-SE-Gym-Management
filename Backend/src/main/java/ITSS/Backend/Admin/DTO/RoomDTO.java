package ITSS.Backend.Admin.DTO;

import lombok.Data;

@Data
public class RoomDTO {
    private Long roomId;
    private String roomName;
    private String roomType;
    private String status;
}
