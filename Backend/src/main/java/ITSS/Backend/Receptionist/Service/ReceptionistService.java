package ITSS.Backend.Receptionist.Service;

import ITSS.Backend.Receptionist.DTO.*;
import ITSS.Backend.entity.Equipment;
import ITSS.Backend.entity.Membership;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.EquipmentRepository;
import ITSS.Backend.repository.MembershipRepository;
import ITSS.Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReceptionistService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EquipmentRepository equipmentRepository;
    private final MembershipRepository membershipRepository;

    public RevenueStatisticsDTO getMonthlyRevenueStatistics(int year, int month) {
        List<Membership> memberships = membershipRepository.findByStartDateInMonth(year, month);

        long totalMembers = membershipRepository.countDistinctMembersByStartDateInMonth(year, month);
        long paidMembers = membershipRepository.countDistinctPaidMembersByStartDateInMonth(year, month);

        double totalRevenue = memberships.stream()
                .filter(m -> m.getPaymentStatus() == Membership.PaymentStatus.Paid)
                .mapToDouble(m -> m.getMembershipPackage() != null ? m.getMembershipPackage().getPrice() : 0)
                .sum();

        Map<String, Long> packageCounts = memberships.stream()
                .collect(Collectors.groupingBy(
                        m -> m.getMembershipPackage() != null ? m.getMembershipPackage().getPackageName() : "Unknown",
                        Collectors.counting()
                ));

        return new RevenueStatisticsDTO(month, year, totalMembers, paidMembers, totalRevenue, packageCounts);
    }

    public AnnualRevenueStatisticsDTO getAnnualRevenue(int year) {
        List<Double> monthlyRevenues = new java.util.ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            List<Membership> memberships = membershipRepository.findByStartDateInMonth(year, month);
            double revenue = memberships.stream()
                    .filter(m -> m.getPaymentStatus() == Membership.PaymentStatus.Paid)
                    .mapToDouble(m -> m.getMembershipPackage() != null ? m.getMembershipPackage().getPrice() : 0)
                    .sum();
            monthlyRevenues.add(revenue);
        }

        return new AnnualRevenueStatisticsDTO(year, monthlyRevenues);
    }

    public List<EquipmentStatisticsWithStatusDTO> getEquipmentStatisticsWithStatus() {
        List<Object[]> rawData = equipmentRepository.getEquipmentStatisticsByRoomStatusAndNotes();
        return rawData.stream()
                .map(obj -> new EquipmentStatisticsWithStatusDTO(
                        (Long) obj[0],   // equipment id
                        (String) obj[1], // room name
                        (String) obj[2], // equipment name
                        (String) obj[3], // status
                        (String) obj[4], // notes
                        (Long) obj[5]    // quantity
                ))
                .collect(Collectors.toList());
    }

    public Equipment updateEquipmentNotesAndStatus(EquipmentUpdateDTO dto) throws Exception {
        Optional<Equipment> optionalEquipment = equipmentRepository.findById(dto.getEquipmentId());
        if (!optionalEquipment.isPresent()) {
            throw new Exception("Thiết bị không tồn tại với id: " + dto.getEquipmentId());
        }

        Equipment equipment = optionalEquipment.get();
        equipment.setNotes(dto.getNotes());
        equipment.setStatus(dto.getStatus());
        return equipmentRepository.save(equipment);
    }

    public ReceptionistProfileDTO getReceptionistProfileByUsername(String username) throws Exception {
        Optional<User> userOpt = userRepository.findByUserName(username);
        if (userOpt.isEmpty() || !userOpt.get().getRole().equalsIgnoreCase("receptionist")) {
            throw new Exception("Không tìm thấy receptionist phù hợp");
        }
        User user = userOpt.get();
        return mapToDTO(user);
    }


    public User updateReceptionistProfile(String username, ReceptionistProfileUpdateDTO dto) throws Exception {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new Exception("Không tìm thấy receptionist phù hợp"));
        if (!user.getRole().equalsIgnoreCase("receptionist")) {
            throw new Exception("Không phải receptionist");
        }

        user.setFullname(dto.getFullname());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        user.setDateOfBirth(dto.getDateOfBirth());

        return userRepository.save(user);
    }

    private ReceptionistProfileDTO mapToDTO(User user) {
        return new ReceptionistProfileDTO(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getPhone(),
                user.getFullname(),
                user.getAddress(),
                user.getDateOfBirth()
        );
    }

    public List<MembershipApprovalDTO> getPendingMembershipApprovals() {
        List<Membership> pendingMemberships = membershipRepository.findByPaymentStatus(Membership.PaymentStatus.Processing);

        return pendingMemberships.stream().map(m -> new MembershipApprovalDTO(
                m.getMembershipId(),
                m.getMember().getUserId(),
                m.getMember().getFullname(),
                m.getMembershipPackage().getPackageName(),
                m.getPaymentStatus().name(),
                m.getStartDate()
        )).collect(Collectors.toList());
    }

    public void approveMembership(Long membershipId) throws Exception {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new Exception("Không tìm thấy membership với ID: " + membershipId));

        if (membership.getPaymentStatus() != Membership.PaymentStatus.Processing) {
            throw new Exception("Gói này không đang ở trạng thái xử lý.");
        }

        membership.setPaymentStatus(Membership.PaymentStatus.Paid);
        membershipRepository.save(membership);
    }

}
