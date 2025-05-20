package com.example.gym.DTO;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMemberDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullname;
    private String address;
    private LocalDate dateOfBirth;
}
