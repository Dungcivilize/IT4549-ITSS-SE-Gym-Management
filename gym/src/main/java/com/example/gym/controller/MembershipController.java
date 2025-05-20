package com.example.gym.controller;

import com.example.gym.entity.Membership;
import com.example.gym.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memberships")
@RequiredArgsConstructor
public class MembershipController {
    private final MembershipService membershipService;

    @PostMapping("/register")
    public ResponseEntity<Membership> register(
            @RequestParam Long memberId,
            @RequestParam Long packageId
    ) {
        return ResponseEntity.ok(membershipService.register(memberId, packageId));
    }

    @PostMapping("/renew")
    public ResponseEntity<Membership> renew(
            @RequestParam Long memberId,
            @RequestParam Long packageId
    ) {
        return ResponseEntity.ok(membershipService.renew(memberId, packageId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        membershipService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}

