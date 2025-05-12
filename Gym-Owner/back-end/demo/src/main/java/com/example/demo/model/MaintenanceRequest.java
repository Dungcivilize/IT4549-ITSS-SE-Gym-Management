package com.example.demo.model;

@Entity
@Table(name = "MaintenanceRequest")
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne
    @JoinColumn(name = "receptionist_id")
    private Receptionist receptionist;

    @Column(name = "request_date")
    private LocalDate requestDate;

    private String status;
    private String notes;

    // Getters, setters, constructors
}
