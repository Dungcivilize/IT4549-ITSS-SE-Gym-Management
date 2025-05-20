package com.example.gym.service;

import com.example.gym.DTO.CreateMemberDTO;
import com.example.gym.DTO.MemberDTO;
import com.example.gym.entity.Member;
import com.example.gym.entity.User;
import com.example.gym.enums.Role;
import com.example.gym.repository.MemberRepository;
import com.example.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final UserRepository userRepo;
    private final MemberRepository memberRepo;

    public List<MemberDTO> getAllMembers() {
        return memberRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MemberDTO createMember(CreateMemberDTO dto) {
        User user = new User();
        user.setUserName(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setFullname(dto.getFullname());
        user.setPassword(dto.getPassword());
        user.setRole(Role.member);
        user.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        user = userRepo.save(user);

        Member member = new Member();
        member.setUser(user);
        member.setAddress(dto.getAddress());
        member.setDateOfBirth(dto.getDateOfBirth());
        member.setRegisterDate(LocalDate.now());
        member = memberRepo.save(member);

        return toDTO(member);
    }

    public MemberDTO updateMember(Long memberId, MemberDTO dto) {
        Member member = memberRepo.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        User user = member.getUser();
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setFullname(dto.getFullname());
        userRepo.save(user);

        member.setAddress(dto.getAddress());
        member.setDateOfBirth(dto.getDateOfBirth());
        memberRepo.save(member);

        return toDTO(member);
    }

    public void deleteMember(Long userId) {
        Member member = memberRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        memberRepo.delete(member);
        userRepo.deleteById(userId);
    }

    private MemberDTO toDTO(Member m) {
        return new MemberDTO(
                m.getMemberId(),
                m.getUser().getUserId(),
                m.getUser().getUserName(),
                m.getUser().getEmail(),
                m.getUser().getPhone(),
                m.getUser().getFullname(),
                m.getAddress(),
                m.getDateOfBirth(),
                m.getRegisterDate()
        );
    }
}
