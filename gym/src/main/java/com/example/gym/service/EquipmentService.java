package com.example.gym.service;

import com.example.gym.entity.Equipment;
import com.example.gym.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipmentService {
    private final EquipmentRepository repository;

    public List<Equipment> getAll() {
        return repository.findAll();
    }

    public Optional<Equipment> getById(Long id) {
        return repository.findById(id);
    }

    public Equipment create(Equipment equipment) {
        return repository.save(equipment);
    }

    public Equipment update(Long id, Equipment newEquipment) {
        Equipment old = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));
        old.setEquipmentName(newEquipment.getEquipmentName());
        old.setQuantity(newEquipment.getQuantity());
        old.setManufacturer(newEquipment.getManufacturer());
        old.setRoom(newEquipment.getRoom());
        return repository.save(old);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
