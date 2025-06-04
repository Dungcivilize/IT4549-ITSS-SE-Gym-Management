package ITSS.Backend.Controller.Admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ITSS.Backend.DTO.Admin.MembershipPackageDTO;
import ITSS.Backend.Service.Admin.MembershipPackageService;

@RestController
@RequestMapping("/api/membership-packages")
public class MembershipPackageController {

    private final MembershipPackageService packageService;

    public MembershipPackageController(MembershipPackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public List<MembershipPackageDTO> getAll() {
        return packageService.getAllPackages();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembershipPackageDTO> getById(@PathVariable Long id) {
        MembershipPackageDTO dto = packageService.getPackageById(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<MembershipPackageDTO> create(@RequestBody MembershipPackageDTO dto) {
        MembershipPackageDTO created = packageService.createPackage(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipPackageDTO> update(@PathVariable Long id, @RequestBody MembershipPackageDTO dto) {
        MembershipPackageDTO updated = packageService.updatePackage(id, dto);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = packageService.deletePackage(id);
        if (!deleted) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}
