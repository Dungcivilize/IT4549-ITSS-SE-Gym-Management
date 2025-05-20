package com.example.gym.service;

import com.example.gym.entity.MaintenanceRequest;
import com.example.gym.repository.MaintenanceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaintenanceRequestService {
    private final MaintenanceRequestRepository repository;

    public List<MaintenanceRequest> getAllRequests() {
        return repository.findAll();
    }

    public Optional<MaintenanceRequest> getRequestById(Long id) {
        return repository.findById(id);
    }

    public MaintenanceRequest createRequest(MaintenanceRequest request) {
        return repository.save(request);
    }

    public MaintenanceRequest updateRequest(Long id, MaintenanceRequest updatedRequest) {
        MaintenanceRequest existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        existing.setEquipment(updatedRequest.getEquipment());
        existing.setReceptionist(updatedRequest.getReceptionist());
        existing.setRequestDate(updatedRequest.getRequestDate());
        existing.setStatus(updatedRequest.getStatus());
        existing.setNotes(updatedRequest.getNotes());
        return repository.save(existing);
    }

    public void deleteRequest(Long id) {
        repository.deleteById(id);
    }

    public List<MaintenanceRequest> getRequestsByReceptionistId(Long receptionistId) {
        return repository.findByReceptionist_ReceptionistId(receptionistId);
    }
}
