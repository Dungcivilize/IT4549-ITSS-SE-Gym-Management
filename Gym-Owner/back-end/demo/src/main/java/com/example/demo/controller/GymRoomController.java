package com.example.demo.controller;

import com.example.demo.model.Room;
import com.example.demo.service.GymRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/gymrooms")
public class GymRoomController {

    @Autowired
    private GymRoomService gymRoomService;

    // ✅ Lấy danh sách tất cả phòng
    @GetMapping
    public List<Room> getAllRooms() {
        return gymRoomService.getAllRooms();
    }

    // ✅ Lấy 1 phòng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return gymRoomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Tạo phòng mới
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room createdRoom = gymRoomService.saveRoom(room);
        return ResponseEntity.ok(createdRoom);
    }

    // ✅ Cập nhật phòng
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        Room updatedRoom = gymRoomService.updateRoom(id, room);
        return ResponseEntity.ok(updatedRoom);
    }

    // ✅ Xoá phòng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        gymRoomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
