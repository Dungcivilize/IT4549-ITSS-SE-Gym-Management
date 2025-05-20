package com.example.gym.repository;

import com.example.gym.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByReceptionist_ReceptionistId(Long receptionistId);
}
