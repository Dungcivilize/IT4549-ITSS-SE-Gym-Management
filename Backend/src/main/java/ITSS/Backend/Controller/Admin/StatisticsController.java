package ITSS.Backend.Controller.Admin;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import ITSS.Backend.repository.UserRepository;
import ITSS.Backend.repository.MembershipPackageRepository;
import ITSS.Backend.repository.EquipmentRepository;
@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MembershipPackageRepository membershipPackageRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @GetMapping("/totals")
    public ResponseEntity<Map<String, Long>> getTotals() {
        Map<String, Long> response = new HashMap<>();

        long totalMembers = userRepository.countByRole("member");  // giả sử có method này
        long totalPackages = membershipPackageRepository.count();
        long totalEquipments = equipmentRepository.count();

        response.put("totalMembers", totalMembers);
        response.put("totalPackages", totalPackages);
        response.put("totalEquipments", totalEquipments);

        return ResponseEntity.ok(response);
    }
}
