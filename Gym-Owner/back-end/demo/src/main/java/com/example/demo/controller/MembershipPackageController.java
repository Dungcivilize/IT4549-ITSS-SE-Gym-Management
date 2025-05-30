package com.example.demo.controller;

import com.example.demo.model.MembershipPackage;
import com.example.demo.repository.MembershipPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
@CrossOrigin(origins = "http://localhost:3000")
public class MembershipPackageController {

    @Autowired
    private MembershipPackageRepository packageRepository;

    @GetMapping
    public List<MembershipPackage> getAllPackages() {
        return packageRepository.findAll();
    }

    @PostMapping
    public MembershipPackage createPackage(@RequestBody MembershipPackage membershipPackage) {
        return packageRepository.save(membershipPackage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembershipPackage> updatePackage(@PathVariable Long id, @RequestBody MembershipPackage updatedPackage) {
        return packageRepository.findById(id)
                .map(pkg -> {
                    pkg.setName(updatedPackage.getName());
                    pkg.setDuration(updatedPackage.getDuration());
                    pkg.setPrice(updatedPackage.getPrice());
                    pkg.setType(updatedPackage.getType());
                    packageRepository.save(pkg);
                    return ResponseEntity.ok(pkg);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Long id) {
        if (packageRepository.existsById(id)) {
            packageRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}