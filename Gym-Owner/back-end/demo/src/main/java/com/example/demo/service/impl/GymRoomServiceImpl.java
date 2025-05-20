package com.example.demo.service.impl;

import com.example.demo.model.Room;
import com.example.demo.repository.GymRoomRepository;
import com.example.demo.service.GymRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GymRoomServiceImpl implements GymRoomService {

    @Autowired
    private GymRoomRepository gymRoomRepository;

    @Override
    public Room saveRoom(Room room) {
        return gymRoomRepository.save(room);
    }

    @Override
    public List<Room> getAllRooms() {
        return gymRoomRepository.findAll();
    }

    @Override
    public Optional<Room> getRoomById(Long id) {
        return gymRoomRepository.findById(id);
    }

    @Override
    public Room updateRoom(Long id, Room roomDetails) {
        Optional<Room> optionalRoom = gymRoomRepository.findById(id);
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            room.setRoomName(roomDetails.getRoomName());
            room.setRoomType(roomDetails.getRoomType());
            room.setStatus(roomDetails.getStatus());
            return gymRoomRepository.save(room);
        } else {
            throw new RuntimeException("Room not found with id: " + id);
        }
    }

    @Override
    public void deleteRoom(Long id) {
        gymRoomRepository.deleteById(id);
    }
}