package com.example.gym.controller;

import com.example.gym.entity.MaintenanceRequest;
import com.example.gym.service.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/maintenance-requests")
@RequiredArgsConstructor
public class MaintenanceRequestController {
    private final MaintenanceRequestService service;

    @GetMapping
    public List<MaintenanceRequest> getAllRequests() {
        return service.getAllRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getRequestById(@PathVariable Long id) {
        return service.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MaintenanceRequest createRequest(@RequestBody MaintenanceRequest request) {
        return service.createRequest(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> updateRequest(@PathVariable Long id, @RequestBody MaintenanceRequest request) {
        try {
            return ResponseEntity.ok(service.updateRequest(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        service.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/receptionist/{receptionistId}")
    public ResponseEntity<List<MaintenanceRequest>> getRequestsByReceptionist(@PathVariable Long receptionistId) {
        return ResponseEntity.ok(service.getRequestsByReceptionistId(receptionistId));
    }

}
