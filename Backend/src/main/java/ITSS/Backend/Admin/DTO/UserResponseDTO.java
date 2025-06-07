package ITSS.Backend.Admin.DTO;

import java.time.LocalDate;
import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String fullname;
    private String email;
    private LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String role;

}