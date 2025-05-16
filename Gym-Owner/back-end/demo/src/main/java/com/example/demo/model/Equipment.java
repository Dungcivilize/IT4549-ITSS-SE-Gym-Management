package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Equipments")
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_id")
    private Long id;

    @Column(name = "equipment_name")
    private String name;

    private Long quantity;
    private String manufacturer;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL)
    private List<MaintenanceRequest> maintenanceRequests;

    // Getters, setters, constructors
}

