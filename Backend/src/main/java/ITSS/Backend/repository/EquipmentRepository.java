package ITSS.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.Equipment;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    @Query("SELECT e.equipmentId, r.roomName, e.equipmentName, e.status, e.notes, e.quantity " +
            "FROM Equipment e JOIN e.room r " +
            "GROUP BY e.equipmentId, r.roomName, e.equipmentName, e.status, e.notes")
    List<Object[]> getEquipmentStatisticsByRoomStatusAndNotes();

} 