package ITSS.Backend.Receptionist.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReceptionistProfileUpdateDTO {
    private String fullname;
    private String address;
    private String phone;
    private String email;
    private LocalDate dateOfBirth;
}
