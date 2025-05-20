package com.example.gym.repository;

import com.example.gym.entity.Receptionist;
import com.example.gym.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReceptionistRepository extends JpaRepository<Receptionist, Long> {
    List<Receptionist> findAllByUserRole(Role role);
    Optional<Receptionist> findByUserUserId(Long userId);
}
