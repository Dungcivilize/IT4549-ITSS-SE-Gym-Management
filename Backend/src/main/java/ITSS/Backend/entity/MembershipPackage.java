package ITSS.Backend.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
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

    @Column(nullable = false)
    private Double price;

    @Column(name = "package_type", nullable = false)
    private String packageType;

    @Column(nullable = false)
    private Boolean PT;

    @ManyToMany
    @JoinTable(
        name = "training_assign",
        joinColumns = @JoinColumn(name = "package_id"),
        inverseJoinColumns = @JoinColumn(name = "trainer_id")
    )
    private List<User> trainers;
} 