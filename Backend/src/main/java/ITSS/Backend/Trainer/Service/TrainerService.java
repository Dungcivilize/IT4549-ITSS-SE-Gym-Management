package ITSS.Backend.Trainer.Service;

import ITSS.Backend.Trainer.DTO.TrainerAttendanceDTO;
import ITSS.Backend.Trainer.DTO.TrainerMemberDTO;
import ITSS.Backend.Trainer.DTO.TrainerUpdateProfile;
import ITSS.Backend.entity.Attendance;
import ITSS.Backend.entity.Membership;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.AttendanceRepository;
import ITSS.Backend.repository.MembershipRepository;
import ITSS.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrainerService {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final AttendanceRepository attendanceRepository;

    public TrainerService(UserRepository userRepository, MembershipRepository membershipRepository, AttendanceRepository attendanceRepository) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.attendanceRepository = attendanceRepository;
    }

    private User findTrainerById(Long trainerId) {
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
        if (!"trainer".equalsIgnoreCase(trainer.getRole())) {
            throw new RuntimeException("User is not a trainer");
        }
        return trainer;
    }

    public List<TrainerMemberDTO> getMembersByTrainer(Long trainerId) {
        findTrainerById(trainerId); // kiểm tra trainer tồn tại và đúng role
        List<Membership> memberships = membershipRepository.findByTrainerUserId(trainerId);
        return memberships.stream().map(m -> new TrainerMemberDTO(
                m.getMember().getUserId(),
                m.getMember().getFullname(),
                m.getMembershipPackage().getPackageName()
        )).collect(Collectors.toList());
    }

    public List<TrainerAttendanceDTO> getAttendancesByMember(Long memberId) {
        List<Attendance> attendances = attendanceRepository.findByMember_UserId(memberId);
        return attendances.stream().map(a -> new TrainerAttendanceDTO(
                a.getAttendanceId(),
                a.getCheckinDate(),
                a.getFeedback()
        )).collect(Collectors.toList());
    }

    public TrainerAttendanceDTO createAttendance(Long memberId) {
        Attendance attendance = new Attendance();
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        attendance.setMember(member);
        attendance.setCheckinDate(LocalDateTime.now());

        Attendance saved = attendanceRepository.save(attendance);
        return new TrainerAttendanceDTO(saved.getAttendanceId(), saved.getCheckinDate(), saved.getFeedback());
    }

    public User updateTrainerProfile(Long trainerId, TrainerUpdateProfile updateProfile) {
        User trainer = findTrainerById(trainerId);

        trainer.setUserName(updateProfile.getUserName());
        trainer.setEmail(updateProfile.getEmail());
        trainer.setPhone(updateProfile.getPhone());
        trainer.setFullname(updateProfile.getFullname());
        trainer.setAddress(updateProfile.getAddress());
        trainer.setDateOfBirth(updateProfile.getDateOfBirth());

        return userRepository.save(trainer);
    }

    public User getTrainerProfile(Long trainerId) {
        return findTrainerById(trainerId);
    }

    public TrainerAttendanceDTO updateAttendanceFeedback(Long attendanceId, String feedback) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
        attendance.setFeedback(feedback);
        Attendance updated = attendanceRepository.save(attendance);
        return new TrainerAttendanceDTO(updated.getAttendanceId(), updated.getCheckinDate(), updated.getFeedback());
    }

}
