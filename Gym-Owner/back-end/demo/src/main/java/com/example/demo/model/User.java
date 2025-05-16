package com.example.demo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    private String userName;
    private String password;
    private String email;
    private String phone;
    private String role;

    @Column(name = "created_at")
    private Timestamp createdAt;

    private String fullname;

    // OneToOne với Trainer, Admin, Receptionist, Member (mappedBy)
    // Getters, setters, constructors
}