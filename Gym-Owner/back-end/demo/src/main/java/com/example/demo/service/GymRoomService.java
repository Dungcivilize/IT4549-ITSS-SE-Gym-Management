package com.example.demo.service;

import com.example.demo.model.Room;

import java.util.List;
import java.util.Optional;

public interface GymRoomService {
    Room saveRoom(Room room);
    List<Room> getAllRooms();
    Optional<Room> getRoomById(Long id);
    Room updateRoom(Long id, Room roomDetails);
    void deleteRoom(Long id);
}
