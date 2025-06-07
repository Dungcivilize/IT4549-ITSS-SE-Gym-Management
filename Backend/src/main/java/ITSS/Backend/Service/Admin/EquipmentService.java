package ITSS.Backend.Service.Admin;

import ITSS.Backend.DTO.Admin.EquipmentDTO;
import ITSS.Backend.entity.Equipment;
import ITSS.Backend.entity.Room;
import ITSS.Backend.repository.EquipmentRepository;
import ITSS.Backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private RoomRepository roomRepository;

    private EquipmentDTO toDTO(Equipment equipment) {
        EquipmentDTO dto = new EquipmentDTO();
        dto.setEquipmentId(equipment.getEquipmentId());
        dto.setEquipmentName(equipment.getEquipmentName());
        dto.setQuantity(equipment.getQuantity());
        dto.setManufacturer(equipment.getManufacturer());
        dto.setPrice(equipment.getPrice());
        dto.setStatus(equipment.getStatus());
        dto.setNotes(equipment.getNotes());
        if (equipment.getRoom() != null) {
            dto.setRoomId(equipment.getRoom().getRoomId());
        }
        return dto;
    }

    private Equipment toEntity(EquipmentDTO dto, Room room) {
        Equipment equipment = new Equipment();
        equipment.setEquipmentId(dto.getEquipmentId());
        equipment.setEquipmentName(dto.getEquipmentName());
        equipment.setQuantity(dto.getQuantity());
        equipment.setManufacturer(dto.getManufacturer());
        equipment.setPrice(dto.getPrice());
        equipment.setStatus(dto.getStatus());
        equipment.setNotes(dto.getNotes());
        equipment.setRoom(room);
        return equipment;
    }

    public List<EquipmentDTO> getAllEquipments() {
        List<Equipment> equipments = equipmentRepository.findAll();
        return equipments.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<EquipmentDTO> getEquipmentById(Long id) {
        return equipmentRepository.findById(id).map(this::toDTO);
    }

    public Optional<EquipmentDTO> createEquipment(EquipmentDTO dto) {
        if (dto.getRoomId() == null) return Optional.empty();

        Optional<Room> room = roomRepository.findById(dto.getRoomId());
        if (room.isEmpty()) return Optional.empty();

        Equipment equipment = toEntity(dto, room.get());
        Equipment saved = equipmentRepository.save(equipment);
        return Optional.of(toDTO(saved));
    }

    public Optional<EquipmentDTO> updateEquipment(Long id, EquipmentDTO dto) {
        Optional<Equipment> existing = equipmentRepository.findById(id);
        if (existing.isEmpty()) return Optional.empty();

        Equipment eq = existing.get();
        eq.setEquipmentName(dto.getEquipmentName());
        eq.setQuantity(dto.getQuantity());
        eq.setManufacturer(dto.getManufacturer());
        eq.setPrice(dto.getPrice());
        eq.setStatus(dto.getStatus());
        eq.setNotes(dto.getNotes());

        if (dto.getRoomId() != null) {
            Optional<Room> room = roomRepository.findById(dto.getRoomId());
            room.ifPresent(eq::setRoom);
        }

        Equipment updated = equipmentRepository.save(eq);
        return Optional.of(toDTO(updated));
    }

    public boolean deleteEquipment(Long id) {
        Optional<Equipment> existing = equipmentRepository.findById(id);
        if (existing.isEmpty()) return false;

        equipmentRepository.delete(existing.get());
        return true;
    }
}
