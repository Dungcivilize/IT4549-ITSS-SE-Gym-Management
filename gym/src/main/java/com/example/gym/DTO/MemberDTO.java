package com.example.gym.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {
    private Long memberId;
    private Long userId;
    private String username;
    private String email;
    private String phone;
    private String fullname;
    private String address;
    private LocalDate dateOfBirth;
    private LocalDate registerDate;
}
