package com.example.demo.controller;
import com.example.demo.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/month")
    public ResponseEntity<Double> getRevenueByMonth(
        @RequestParam int month,
        @RequestParam int year) {
        double revenue = revenueService.getRevenueByMonth(month, year);
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/date")
    public ResponseEntity<Double> getRevenueByDate(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        double revenue = revenueService.getRevenueByDate(date);
        return ResponseEntity.ok(revenue);
    }
}