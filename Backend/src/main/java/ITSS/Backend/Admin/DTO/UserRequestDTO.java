package ITSS.Backend.Admin.DTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserRequestDTO {
    private String userName;
    private String password;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdAt;
    private String fullname;
    private String address;
    private LocalDate dateOfBirth;

}