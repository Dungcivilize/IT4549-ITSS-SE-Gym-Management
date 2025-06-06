package ITSS.Backend.Admin.Controller;

import ITSS.Backend.Admin.Service.AdminMembershipService;
import ITSS.Backend.Admin.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestParam;
@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private AdminMembershipService adminMembershipService;

    @GetMapping("/month")
    public Map<Integer, Double> getMonthlyRevenue(@RequestParam int year) {
        return adminMembershipService.getMonthlyRevenue(year);
    }
}
