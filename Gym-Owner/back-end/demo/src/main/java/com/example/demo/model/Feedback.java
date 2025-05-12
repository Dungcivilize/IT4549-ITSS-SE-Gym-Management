package com.example.demo.model;

@Entity
@Table(name = "Feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "feedback_text")
    private String feedbackText;

    @Column(name = "feedback_date")
    private LocalDate feedbackDate;

    // Getters, setters, constructors
}
