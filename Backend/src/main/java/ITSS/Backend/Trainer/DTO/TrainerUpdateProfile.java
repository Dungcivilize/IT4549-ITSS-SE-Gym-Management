package ITSS.Backend.Trainer.DTO;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TrainerUpdateProfile {
    private String userName;
    private String email;
    private String phone;
    private String fullname;
    private String address;
    private LocalDate dateOfBirth;
}
