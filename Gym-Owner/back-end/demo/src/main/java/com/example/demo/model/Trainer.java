package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;
import java.sql.Timestamp;


@Entity
@Table(name = "Trainers")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trainer_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String specialty;
    private Double salary;

    @Column(name = "hire_date")
    private Timestamp hireDate;

    @OneToMany(mappedBy = "trainer")
    private List<TrainerAssignment> assignments;

    // Getters, setters, constructors
}
