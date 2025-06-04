package ITSS.Backend.Service.Admin;

import ITSS.Backend.DTO.Admin.RoomDTO;
import ITSS.Backend.entity.Room;
import ITSS.Backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // Convert Room entity -> RoomDTO
    private RoomDTO toDTO(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setRoomId(room.getRoomId());
        dto.setRoomName(room.getRoomName());
        dto.setRoomType(room.getRoomType());
        dto.setStatus(room.getStatus());
        return dto;
    }

    // Convert RoomDTO -> Room entity (dùng cho tạo mới và cập nhật)
    private Room toEntity(RoomDTO dto) {
        Room room = new Room();
        room.setRoomId(dto.getRoomId());
        room.setRoomName(dto.getRoomName());
        room.setRoomType(dto.getRoomType());
        room.setStatus(dto.getStatus());
        return room;
    }

    // Lấy danh sách phòng (RoomDTO)
    public List<RoomDTO> getAllRooms() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Lấy phòng theo id
    public RoomDTO getRoomById(Long id) {
        Optional<Room> optRoom = roomRepository.findById(id);
        return optRoom.map(this::toDTO).orElse(null);
    }

    // Tạo phòng mới
    public RoomDTO createRoom(RoomDTO dto) {
        Room room = toEntity(dto);
        room.setRoomId(null); // đảm bảo là tạo mới
        Room saved = roomRepository.save(room);
        return toDTO(saved);
    }

    // Cập nhật phòng
    public RoomDTO updateRoom(Long id, RoomDTO dto) {
        Optional<Room> optRoom = roomRepository.findById(id);
        if (optRoom.isEmpty()) {
            return null;
        }
        Room room = optRoom.get();
        room.setRoomName(dto.getRoomName());
        room.setRoomType(dto.getRoomType());
        room.setStatus(dto.getStatus());
        Room updated = roomRepository.save(room);
        return toDTO(updated);
    }

    // Xóa phòng
    public boolean deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            return false;
        }
        roomRepository.deleteById(id);
        return true;
    }
}
