package com.example.gym.service;

import com.example.gym.entity.Receptionist;
import com.example.gym.enums.Role;
import com.example.gym.repository.ReceptionistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReceptionistService {
    private final ReceptionistRepository receptionistRepository;

    public List<Receptionist> getAllReceptionists() {
        return receptionistRepository.findAllByUserRole(Role.receptionist);
    }

    public Optional<Receptionist> getReceptionistById(Long id) {
        return receptionistRepository.findById(id);
    }

    public Optional<Receptionist> getReceptionistByUserId(Long userId) {
        return receptionistRepository.findByUserUserId(userId);
    }

    public Receptionist createReceptionist(Receptionist receptionist) {
        return receptionistRepository.save(receptionist);
    }

    public Receptionist updateReceptionist(Long id, Receptionist receptionistUpdate) {
        return receptionistRepository.findById(id)
                .map(receptionist -> {
                    receptionist.setSalary(receptionistUpdate.getSalary());
                    receptionist.setHireDate(receptionistUpdate.getHireDate());
                    receptionist.setUser(receptionistUpdate.getUser());
                    return receptionistRepository.save(receptionist);
                }).orElseThrow(() -> new RuntimeException("Receptionist not found"));
    }

    public void deleteReceptionist(Long id) {
        receptionistRepository.deleteById(id);
    }
}
