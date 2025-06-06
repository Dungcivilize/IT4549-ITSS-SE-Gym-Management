package ITSS.Backend.Admin.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ITSS.Backend.Admin.DTO.MembershipPackageDTO;
import ITSS.Backend.Admin.Service.AdminMembershipPackageService;

@RestController
@RequestMapping("/api/membership-packages")
public class AdminMembershipPackageController {

    private final AdminMembershipPackageService packageService;

    public AdminMembershipPackageController(AdminMembershipPackageService packageService) {
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
