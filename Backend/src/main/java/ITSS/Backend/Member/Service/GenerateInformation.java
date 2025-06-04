package ITSS.Backend.Member.Service;

import org.springframework.stereotype.Service;

import java.util.UUID;
@Service
public class GenerateInformation {
    public String generateUsername(String fullname) {
        String[] parts = fullname.trim().split("\\s+");
        if (parts.length >= 2) {
            return parts[parts.length - 2] + " " + parts[parts.length - 1];
        }
        return fullname;
    }

    public String generatePassword() {
        return UUID.randomUUID().toString().substring(0, 8); // Ví dụ: a1b2c3d4
    }
}
