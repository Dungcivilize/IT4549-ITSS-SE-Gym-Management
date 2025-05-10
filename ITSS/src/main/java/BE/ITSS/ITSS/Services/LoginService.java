package BE.ITSS.ITSS.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import BE.ITSS.ITSS.DTO.LoginResponse;
import BE.ITSS.ITSS.Models.User;
import BE.ITSS.ITSS.Repositories.UserRepository;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;
    

    public LoginResponse login(String userName, String password) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return new LoginResponse(
            "Login successful",
            user.getUser_id(),
            user.getUser_name(),
            user.getRole(),
            user.getFullname()
        );
    }
}