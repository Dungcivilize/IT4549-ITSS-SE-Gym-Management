package ITSS.Backend.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "MembershipPackage")
public class MembershipPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long packageId;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(nullable = false)
    private Long duration;

    @Column(name = "max_pt_meeting_days")
    private Integer maxPtMeetingDays;

    @Column(nullable = false)
    private Long price;

    @Column(nullable = false)
    private Boolean PT;

    @Column
    private Double discount;

    @Column(name = "package_type")
    private String packageType;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany
    @JoinTable(
            name = "training_assign",
            joinColumns = @JoinColumn(name = "package_id"),
            inverseJoinColumns = @JoinColumn(name = "trainer_id")
    )
    private List<User> trainers;
}
