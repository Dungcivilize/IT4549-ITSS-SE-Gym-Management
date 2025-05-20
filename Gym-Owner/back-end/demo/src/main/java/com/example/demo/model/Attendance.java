package com.example.demo.model;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "check_in_time")
    private Timestamp checkInTime;

    @Column(name = "check_out_time")
    private Timestamp checkOutTime;

    // Getters, setters, constructors
}
