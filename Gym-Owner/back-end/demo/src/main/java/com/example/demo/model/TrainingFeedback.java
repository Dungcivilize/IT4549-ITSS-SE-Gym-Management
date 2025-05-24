package com.example.demo.model;

import jakarta.persistence.*;
@Entity
@Table(name = "trainingfeedback")
public class TrainingFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private String result;

    // Getters, setters, constructors
}
