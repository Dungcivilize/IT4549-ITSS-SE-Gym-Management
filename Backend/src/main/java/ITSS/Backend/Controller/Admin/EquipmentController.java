package ITSS.Backend.Controller.Admin;

import ITSS.Backend.DTO.Admin.EquipmentDTO;
import ITSS.Backend.Service.Admin.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/equipments")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    @GetMapping
    public List<EquipmentDTO> getAll() {
        return equipmentService.getAllEquipments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentDTO> getById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody EquipmentDTO dto) {
        Optional<EquipmentDTO> created = equipmentService.createEquipment(dto);
        if (created.isPresent()) {
            return ResponseEntity.ok(created.get());
        } else {
            return ResponseEntity.badRequest().body("Room not found or missing");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody EquipmentDTO dto) {
        return equipmentService.updateEquipment(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = equipmentService.deleteEquipment(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
