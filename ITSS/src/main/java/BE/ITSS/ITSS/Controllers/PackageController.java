package BE.ITSS.ITSS.Controllers;

import BE.ITSS.ITSS.DTO.PackageResponse;
import BE.ITSS.ITSS.Services.MembershipPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private MembershipPackageService packageService;

    @GetMapping
    public ResponseEntity<List<PackageResponse>> getAllPackages() {
        List<PackageResponse> packages = packageService.getAllPackages();
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageResponse> getPackageById(@PathVariable Long id) {
        PackageResponse pack = packageService.getPackageById(id);
        return ResponseEntity.ok(pack);
    }

}
