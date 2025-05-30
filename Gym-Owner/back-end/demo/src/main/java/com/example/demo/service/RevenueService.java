package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.MembershipRepository;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class RevenueService {

    @Autowired
    private MembershipRepository membershipRepository;

    public double getRevenueByMonth(int month, int year) {
        return Optional.ofNullable(membershipRepository.getRevenueByMonth(month, year)).orElse(0.0);
    }

    public double getRevenueByDate(LocalDate date) {
        return Optional.ofNullable(membershipRepository.getRevenueByDate(date)).orElse(0.0);
    }
}
