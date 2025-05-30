package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.demo.model.Membership;
import java.time.LocalDate;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
    @Query("SELECT SUM(m.membershipPackage.price) FROM Membership m " +
           "WHERE m.paymentStatus = 'Đã thanh toán' " +
           "AND FUNCTION('MONTH', m.startDate) = :month " +
           "AND FUNCTION('YEAR', m.startDate) = :year")
    Double getRevenueByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT SUM(m.membershipPackage.price) FROM Membership m " +
           "WHERE m.paymentStatus = 'Đã thanh toán' " +
           "AND m.startDate = :date")
    Double getRevenueByDate(@Param("date") LocalDate date);
}
