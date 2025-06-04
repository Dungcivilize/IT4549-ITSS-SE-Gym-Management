package ITSS.Backend.Member.Controller;

import java.sql.Date;
import java.time.LocalDateTime;

import ITSS.Backend.Member.DTO.RegisterRequest;
import ITSS.Backend.Member.Service.EmailService;
import ITSS.Backend.Member.Service.GenerateInformation;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

@RestController
@RequestMapping("/api")
public class RegisterController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GenerateInformation generateInformation;
    
    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult bindingResult) {
        // Kiểm tra validation
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body("Dữ liệu không hợp lệ: " + bindingResult.getAllErrors());
        }

        // Kiểm tra trùng email
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email đã được sử dụng");
        }

        try {
            String username = generateInformation.generateUsername(request.getFullname());
            String rawPassword = generateInformation.generatePassword();

            User user = new User();
            user.setUserName(username);
            user.setPassword(rawPassword); // Lưu mật khẩu dưới dạng plain text
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setCreatedAt(LocalDateTime.now());
            user.setFullname(request.getFullname());
            user.setRole("member");
            user.setAddress(request.getAddress());
            user.setDateOfBirth(request.getDateOfBirth());

            userRepository.save(user);

            // Gửi email
            String content = "Chào " + request.getFullname() + ",\n\n"
                    + "Tài khoản của bạn đã được tạo thành công:\n"
                    + "Username: " + username + "\n"
                    + "Password: " + rawPassword + "\n\n"
                    + "Vui lòng đổi mật khẩu sau khi đăng nhập.\n";

            emailService.sendEmail(request.getEmail(), "Thông tin đăng nhập hệ thống", content);

            return ResponseEntity.ok("Đăng ký thành công. Vui lòng kiểm tra email để nhận thông tin đăng nhập.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra trong quá trình đăng ký: " + e.getMessage());
        }
    }
}


