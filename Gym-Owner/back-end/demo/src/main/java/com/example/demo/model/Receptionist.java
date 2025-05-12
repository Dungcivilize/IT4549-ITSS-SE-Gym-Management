package com.example.demo.model;

@Entity
@Table(name = "Receptionists")
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
