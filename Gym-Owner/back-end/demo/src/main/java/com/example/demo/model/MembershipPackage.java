package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
@Entity
@Table(name = "MembershipPackage")
public class MembershipPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long id;

    @Column(name = "package_name")
    private String name;

    private Long duration;
    private Double price;

    @Column(name = "package_type")
    private String type;

    @OneToMany(mappedBy = "membershipPackage")
    private List<Membership> memberships;

    // Getters, setters, constructors
}

