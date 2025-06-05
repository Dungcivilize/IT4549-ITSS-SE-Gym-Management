package ITSS.Backend.Member.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ITSS.Backend.Member.DTO.RoomResponse;
import ITSS.Backend.repository.RoomRepository;

@RestController
@RequestMapping("/api/member/rooms")
public class MemberRoomController {

    @Autowired
    private RoomRepository roomRepository;

    // Lấy danh sách tất cả phòng
    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<RoomResponse> rooms = roomRepository.findAll().stream()
                .map(room -> new RoomResponse(room.getRoomId(), room.getRoomName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(rooms);
    }
}