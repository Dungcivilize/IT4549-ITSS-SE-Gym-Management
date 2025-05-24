package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
@Entity
@Table(name = "receptionists")
public class Receptionist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receptionist_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Long salary;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @OneToMany(mappedBy = "receptionist")
    private List<MaintenanceRequest> maintenanceRequests;

    // Getters, setters, constructors
}
