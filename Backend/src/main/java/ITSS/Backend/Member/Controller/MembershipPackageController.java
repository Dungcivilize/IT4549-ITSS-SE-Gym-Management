package ITSS.Backend.Member.Controller;

import ITSS.Backend.Member.Service.MembershipPackageService;
import ITSS.Backend.entity.Membership;
import ITSS.Backend.entity.MembershipPackage;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.MembershipPackageRepository;
import ITSS.Backend.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class MembershipPackageController {

    private final MembershipPackageService membershipPackageService;
    private final MembershipPackageRepository membershipPackageRepository;
    private final MembershipRepository membershipRepository;

    @GetMapping
    public ResponseEntity<?> getAllPackages() {
        return ResponseEntity.ok(membershipPackageService.getAllPackages());
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getPackageDetail(@PathVariable Long id) {
        return membershipPackageService.getPackageById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy gói tập"));
    }

    @GetMapping("/{id}/trainers")
    public ResponseEntity<?> getEligibleTrainers(@PathVariable Long id) {
        Optional<MembershipPackage> optionalPackage = membershipPackageRepository.findById(id);

        if (optionalPackage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy gói tập");
        }

        MembershipPackage pkg = optionalPackage.get();

        List<User> eligibleTrainers = pkg.getTrainers().stream()
                .filter(trainer ->
                        membershipRepository.countByTrainerAndPaymentStatus(
                                trainer,
                                Membership.PaymentStatus.Processing
                        ) < 8
                )
                .toList();

        return ResponseEntity.ok(eligibleTrainers);
    }



}
