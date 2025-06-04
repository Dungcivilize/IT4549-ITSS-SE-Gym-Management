package ITSS.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import ITSS.Backend.entity.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByRoomId(Long roomId);
} 