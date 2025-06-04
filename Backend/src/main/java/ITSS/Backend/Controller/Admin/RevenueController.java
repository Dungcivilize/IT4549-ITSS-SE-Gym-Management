package ITSS.Backend.Controller.Admin;

import ITSS.Backend.Service.Admin.*;
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
    private MembershipService membershipService;

    @GetMapping("/month")
    public Map<Integer, Double> getMonthlyRevenue(@RequestParam int year) {
        return membershipService.getMonthlyRevenue(year);
    }
}
