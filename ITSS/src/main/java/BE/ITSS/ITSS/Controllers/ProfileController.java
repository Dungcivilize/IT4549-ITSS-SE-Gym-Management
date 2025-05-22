package BE.ITSS.ITSS.Controllers;

import BE.ITSS.ITSS.DTO.UpdateMemberRequest;
import BE.ITSS.ITSS.Models.User;
import BE.ITSS.ITSS.Models.Member;
import BE.ITSS.ITSS.Repositories.UserRepository;
import BE.ITSS.ITSS.Repositories.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MemberRepository memberRepository;
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
        if (request.getUser_name() != null) user.setUser_name(request.getUser_name());
        if (request.getPassword() != null) user.setPassword(request.getPassword());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if(request.getFullname() != null) user.setFullname(request.getFullname());
        userRepository.save(user);

        Optional<Member> optionalMember = memberRepository.findByUserId(userId);
        if (optionalMember.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy thành viên."));
        }

        Member member = optionalMember.get();
        if (request.getAddress() != null) member.setAddress(request.getAddress());
        if (request.getDate_of_birth() != null) member.setDate_of_birth(request.getDate_of_birth());
        memberRepository.save(member);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Cập nhật thông tin thành công!");
        response.put("user", user);
        response.put("member", member);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/members/user/{userId}")
    public ResponseEntity<Long> getMemberIdByUserId(@PathVariable Long userId) {
        Long memberId = memberRepository.findMemberIdByUserId(userId);
        return ResponseEntity.ok(memberId);
    }

}

