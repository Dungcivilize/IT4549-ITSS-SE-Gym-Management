package com.example.demo.model;

@Entity
@Table(name = "Members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dob;

    @Column(name = "register_date")
    private LocalDate registerDate;

    @OneToMany(mappedBy = "member")
    private List<Membership> memberships;

    @OneToMany(mappedBy = "member")
    private List<TrainerAssignment> trainerAssignments;

    @OneToMany(mappedBy = "member")
    private List<Feedback> feedbacks;

    // Getters, setters, constructors
}
