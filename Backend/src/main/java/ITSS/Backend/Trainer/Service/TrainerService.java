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

import java.time.LocalDate;
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
        findTrainerById(trainerId);
        LocalDate today = LocalDate.now();
        List<Membership> memberships = membershipRepository.findByTrainerUserIdAndPaymentStatusAndEndDateAfter(
                trainerId, Membership.PaymentStatus.Paid, today);

        return memberships.stream()
                .map(m -> new TrainerMemberDTO(
                        m.getMember().getUserId(),
                        m.getMember().getFullname(),
                        m.getMembershipPackage().getPackageName()
                ))
                .collect(Collectors.toList());
    }




    public List<TrainerAttendanceDTO> getAttendancesByMember(Long memberId) {
        List<Attendance> attendances = attendanceRepository.findByMember_UserId(memberId);

        Membership membership = membershipRepository.findTopByMemberUserIdOrderByStartDateDesc(memberId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        int ptLeft = membership.getPtMeetingDaysLeft().intValue();
        int ptUsed = (int) attendances.stream()
                .filter(a -> a.getFeedback() != null && !a.getFeedback().isEmpty())
                .count();

        return attendances.stream().map(a -> new TrainerAttendanceDTO(
                a.getAttendanceId(),
                a.getCheckinDate(),
                a.getFeedback(),
                ptLeft,
                ptUsed
        )).collect(Collectors.toList());
    }

    public TrainerAttendanceDTO createAttendance(Long memberId) {
        Attendance attendance = new Attendance();
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        attendance.setMember(member);
        attendance.setCheckinDate(LocalDateTime.now());

        Attendance saved = attendanceRepository.save(attendance);

        Membership membership = membershipRepository.findTopByMemberUserIdOrderByStartDateDesc(memberId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));
        int ptLeft = membership.getPtMeetingDaysLeft().intValue();
        int ptUsed = attendanceRepository.countByMember_UserIdAndFeedbackIsNotNull(memberId);

        return new TrainerAttendanceDTO(saved.getAttendanceId(), saved.getCheckinDate(), saved.getFeedback(), ptLeft, ptUsed);
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

        // Kiểm tra feedback cũ
        String oldFeedback = attendance.getFeedback();

        // Nếu feedback cũ null hoặc rỗng, và feedback mới khác null/rỗng thì giảm pt_meeting_days_left
        if ((oldFeedback == null || oldFeedback.isEmpty()) && (feedback != null && !feedback.isEmpty())) {
            Long memberId = attendance.getMember().getUserId();
            Membership membership = membershipRepository.findTopByMemberUserIdOrderByStartDateDesc(memberId)
                    .orElseThrow(() -> new RuntimeException("Membership not found"));

            // Giảm pt_meeting_days_left, tránh giảm dưới 0
            Long ptLeft = membership.getPtMeetingDaysLeft();
            if (ptLeft != null && ptLeft > 0) {
                membership.setPtMeetingDaysLeft(ptLeft - 1);  // ptLeft - 1 là long - long = long, tự động phù hợp Long
                membershipRepository.save(membership);
            }

        }

        // Cập nhật feedback mới
        attendance.setFeedback(feedback);
        Attendance updated = attendanceRepository.save(attendance);

        // Lấy dữ liệu cập nhật lại ptLeft, ptUsed
        Long memberId = updated.getMember().getUserId();
        Membership membership = membershipRepository.findTopByMemberUserIdOrderByStartDateDesc(memberId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        Long ptLeftLong = membership.getPtMeetingDaysLeft();
        int ptLeft = ptLeftLong != null ? ptLeftLong.intValue() : 0;

        int ptUsed = attendanceRepository.countByMember_UserIdAndFeedbackIsNotNull(memberId);

        return new TrainerAttendanceDTO(updated.getAttendanceId(), updated.getCheckinDate(), updated.getFeedback(), ptLeft, ptUsed);
    }


}
