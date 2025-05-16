package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
@Entity
@Table(name = "TrainerAssignment")
public class TrainerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @Column(name = "training_date")
    private LocalDate trainingDate;

    private String status;

    // Getters, setters, constructors
}
