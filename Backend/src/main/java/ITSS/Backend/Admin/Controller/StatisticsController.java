package ITSS.Backend.Admin.Controller;

import ITSS.Backend.entity.Equipment;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.EquipmentRepository;
import ITSS.Backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final UserRepository userRepository;

    @GetMapping("/age-groups")
    public ResponseEntity<List<Map<String, Object>>> getAgeGroupStats() {
        List<User> users = userRepository.findAll();
        Map<String, Integer> ageGroups = new HashMap<>();

        LocalDate now = LocalDate.now();
        for (User user : users) {
            int age = Period.between(user.getDateOfBirth(), now).getYears();
            String group;
            if (age < 18) group = "<18";
            else if (age < 30) group = "18-29";
            else if (age < 45) group = "30-44";
            else if (age < 60) group = "45-59";
            else group = "60+";

            ageGroups.put(group, ageGroups.getOrDefault(group, 0) + 1);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : ageGroups.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("range", entry.getKey());
            map.put("count", entry.getValue());
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    private final EquipmentRepository equipmentRepository;

    @GetMapping("/equipment-status")
    public ResponseEntity<Map<String, Integer>> getEquipmentStatusStats() {
        List<Equipment> equipments = equipmentRepository.findAll();
        Map<String, Integer> statusCount = new HashMap<>();

        for (Equipment equipment : equipments) {
            String status = equipment.getStatus();
            statusCount.put(status, statusCount.getOrDefault(status, 0) + 1);
        }

        return ResponseEntity.ok(statusCount);
    }
}

