package ITSS.Backend.Admin.Controller;

import ITSS.Backend.Admin.DTO.RevenueDto;
import ITSS.Backend.Admin.Service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/monthly")
    public List<RevenueDto> getMonthlyRevenue(@RequestParam int year) {
        return revenueService.getMonthlyRevenue(year);
    }

}
