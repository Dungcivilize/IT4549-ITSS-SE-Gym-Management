package ITSS.Backend.Member.Controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import ITSS.Backend.Member.DTO.UpdateMemberRequest;
import ITSS.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ITSS.Backend.entity.User;


@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // localhost::8080/api/profile/update/
    @PatchMapping("/update/{userId}")
    public ResponseEntity<?> updateMemberInfo(
            @PathVariable Long userId,
            @RequestBody UpdateMemberRequest request) {

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy người dùng."));
        }

        User user = optionalUser.get();

        // Chỉ cập nhật nếu người dùng gửi lên trường tương ứng
        if (request.getUserName() != null) user.setUserName(request.getUserName());
        if (request.getPassword() != null) user.setPassword(request.getPassword());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if(request.getFullname() != null) user.setFullname(request.getFullname());
        if(request.getAddress() != null) user.setAddress(request.getAddress());
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cập nhật thông tin thành công!");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }


}
