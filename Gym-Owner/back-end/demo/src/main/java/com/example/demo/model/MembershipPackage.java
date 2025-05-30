package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;
@Entity
@Table(name = "membershippackage")
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
    public MembershipPackage() {
    }
    public MembershipPackage(Long id, String name, Long duration, Double price, String type) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.price = price;
        this.type = type;
    }
    // Getters, setters, constructors
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Long getDuration() {
        return duration;
    }
    public void setDuration(Long duration) {
        this.duration = duration;
    }
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

}

