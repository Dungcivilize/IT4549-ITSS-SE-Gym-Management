package com.example.demo.controller;

import com.example.demo.model.Equipment;
import com.example.demo.model.Room;
import com.example.demo.repository.EquipmentRepository;
import com.example.demo.repository.GymRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/rooms/{roomId}/equipments")
public class EquipmentController {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private GymRoomRepository roomRepository;

    // CREATE: Thêm thiết bị mới vào phòng
    @PostMapping
    public ResponseEntity<?> createEquipment(
            @PathVariable Long roomId,
            @RequestBody Equipment equipmentRequest) {
        
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Room not found with id: " + roomId);
        }

        Room room = roomOpt.get();
        equipmentRequest.setRoom(room);
        Equipment savedEquipment = equipmentRepository.save(equipmentRequest);
        
        return new ResponseEntity<>(savedEquipment, HttpStatus.CREATED);
    }

    // READ: Lấy tất cả thiết bị trong phòng
    @GetMapping
    public ResponseEntity<?> getAllEquipmentsByRoom(@PathVariable Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Room not found with id: " + roomId);
        }
        
        List<Equipment> equipments = equipmentRepository.findByRoomId(roomId);
        return new ResponseEntity<>(equipments, HttpStatus.OK);
    }

    // READ: Lấy thiết bị cụ thể trong phòng
    @GetMapping("/{equipmentId}")
    public ResponseEntity<?> getEquipmentById(
            @PathVariable Long roomId,
            @PathVariable Long equipmentId) {
        
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Equipment not found with id: " + equipmentId);
        }

        Equipment equipment = equipmentOpt.get();
        if (!equipment.getRoom().getId().equals(roomId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Equipment does not belong to room id: " + roomId);
        }
        
        return new ResponseEntity<>(equipment, HttpStatus.OK);
    }

    // UPDATE: Cập nhật thiết bị trong phòng
    @PutMapping("/{equipmentId}")
    public ResponseEntity<?> updateEquipment(
            @PathVariable Long roomId,
            @PathVariable Long equipmentId,
            @RequestBody Equipment equipmentDetails) {
        
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Equipment not found with id: " + equipmentId);
        }

        Equipment existingEquipment = equipmentOpt.get();
        
        // Kiểm tra thiết bị có thuộc phòng này không
        if (!existingEquipment.getRoom().getId().equals(roomId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Equipment does not belong to room id: " + roomId);
        }
        
        // Cập nhật thông tin
        if (equipmentDetails.getName() != null) {
            existingEquipment.setName(equipmentDetails.getName());
        }
        if (equipmentDetails.getQuantity() != null) {
            existingEquipment.setQuantity(equipmentDetails.getQuantity());
        }
        if (equipmentDetails.getManufacturer() != null) {
            existingEquipment.setManufacturer(equipmentDetails.getManufacturer());
        }
        
        Equipment updatedEquipment = equipmentRepository.save(existingEquipment);
        return new ResponseEntity<>(updatedEquipment, HttpStatus.OK);
    }

    // DELETE: Xóa thiết bị khỏi phòng
    @DeleteMapping("/{equipmentId}")
    public ResponseEntity<?> deleteEquipment(
            @PathVariable Long roomId,
            @PathVariable Long equipmentId) {
        
        Optional<Equipment> equipmentOpt = equipmentRepository.findById(equipmentId);
        if (equipmentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Equipment not found with id: " + equipmentId);
        }

        Equipment equipment = equipmentOpt.get();
        
        // Kiểm tra thiết bị có thuộc phòng này không
        if (!equipment.getRoom().getId().equals(roomId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Equipment does not belong to room id: " + roomId);
        }
        
        equipmentRepository.deleteById(equipmentId);
        return ResponseEntity.noContent().build();
    }
}