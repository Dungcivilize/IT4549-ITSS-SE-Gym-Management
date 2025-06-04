package ITSS.Backend.Receptionist.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReceptionistProfileDTO {
    private Long id;
    private String username;
    private String email;
    private String phone;
    private String fullname;
    private String address;
    private LocalDate dateOfBirth;
}
