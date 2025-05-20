package com.example.gym.service;

import com.example.gym.entity.Member;
import com.example.gym.entity.Membership;
import com.example.gym.entity.MembershipPackage;
import com.example.gym.repository.MemberRepository;
import com.example.gym.repository.MembershipPackageRepository;
import com.example.gym.repository.MembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MembershipService {
    private final MembershipRepository membershipRepository;
    private final MembershipPackageRepository packageRepository;
    private final MemberRepository memberRepository;

    public Membership register(Long memberId, Long packageId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        MembershipPackage pack = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        LocalDate now = LocalDate.now();
        LocalDate end = now.plusMonths(pack.getDuration());

        Membership membership = new Membership(null, member, pack, now, end, "PAID");
        return membershipRepository.save(membership);
    }

    public Membership renew(Long memberId, Long packageId) {
        Membership existing = membershipRepository.findByMember_MemberId(memberId)
                .orElseThrow(() -> new RuntimeException("Membership not found"));

        MembershipPackage pack = packageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        existing.setEndDate(existing.getEndDate().plusMonths(pack.getDuration()));
        return membershipRepository.save(existing);
    }

    public void cancel(Long membershipId) {
        membershipRepository.deleteById(membershipId);
    }
}

