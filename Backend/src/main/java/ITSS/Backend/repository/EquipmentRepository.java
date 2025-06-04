package ITSS.Backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.Room;
import ITSS.Backend.entity.Equipment;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByRoom(Room room);
    Optional<Equipment> findById(Long id);
} 