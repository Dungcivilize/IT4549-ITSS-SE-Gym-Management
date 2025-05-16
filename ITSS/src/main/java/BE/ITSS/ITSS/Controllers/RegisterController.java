package BE.ITSS.ITSS.Controllers;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import BE.ITSS.ITSS.DTO.RegisterRequest;
import BE.ITSS.ITSS.Models.Member;
import BE.ITSS.ITSS.Models.User;
import BE.ITSS.ITSS.Repositories.MemberRepository;
import BE.ITSS.ITSS.Repositories.UserRepository;
import BE.ITSS.ITSS.Services.EmailService;
import BE.ITSS.ITSS.Services.GenerateInformation;

@RestController
@RequestMapping("/api")
public class RegisterController{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private GenerateInformation generateInformation;
    @Autowired
    private EmailService emailService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Kiểm tra trùng email
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email đã được sử dụng");
        }

        String username = generateInformation.generateUsername(request.getFullname());
        String rawPassword = generateInformation.generatePassword();

        User user = new User();
        user.setUser_name(username);
        user.setPassword(rawPassword);
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFullname(request.getFullname());
        user.setRole("member");
        user.setCreated_at(new Date(System.currentTimeMillis()));

        userRepository.save(user);

        Member member = new Member();
        member.setUser(user);
        member.setAddress(request.getAddress());
        member.setDate_of_birth(request.getDateOfBirth());
        member.setRegister_date(new Date(System.currentTimeMillis()));

        memberRepository.save(member);

        // Gửi email
        String content = "Chào " + request.getFullname() + ",\n\n"
                + "Tài khoản của bạn đã được tạo thành công:\n"
                + "Username: " + username + "\n"
                + "Password: " + rawPassword + "\n\n"
                + "Vui lòng đổi mật khẩu sau khi đăng nhập.\n";

        emailService.sendEmail(request.getEmail(), "Thông tin đăng nhập hệ thống", content);

        return ResponseEntity.ok("Đăng ký thành công. Vui lòng kiểm tra email để nhận thông tin đăng nhập.");
    }
}


