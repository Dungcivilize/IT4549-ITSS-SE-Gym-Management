package ITSS.Backend.Receptionist.Service;

import ITSS.Backend.Receptionist.DTO.AnnualRevenueStatisticsDTO;
import ITSS.Backend.Receptionist.DTO.EquipmentStatisticsWithStatusDTO;
import ITSS.Backend.Receptionist.DTO.EquipmentUpdateDTO;
import ITSS.Backend.Receptionist.DTO.RevenueStatisticsDTO;
import ITSS.Backend.entity.Equipment;
import ITSS.Backend.entity.Membership;
import ITSS.Backend.repository.EquipmentRepository;
import ITSS.Backend.repository.MembershipRepository;
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
                        (Long) obj[5]    // count
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


}
