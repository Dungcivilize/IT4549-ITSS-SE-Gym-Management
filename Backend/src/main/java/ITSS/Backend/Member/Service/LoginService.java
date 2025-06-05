package ITSS.Backend.Member.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ITSS.Backend.Member.DTO.LoginResponse;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.UserRepository;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Email không tồn tại");
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        return new LoginResponse(
                "Đăng nhập thành công",
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt(),
                user.getFullname(),
                user.getAddress(),
                user.getDateOfBirth()
        );
    }
}
