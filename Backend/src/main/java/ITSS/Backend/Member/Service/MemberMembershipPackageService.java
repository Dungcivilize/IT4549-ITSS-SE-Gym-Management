package ITSS.Backend.Member.Service;

import ITSS.Backend.Member.DTO.MembershipPackageDetailResponse;
import ITSS.Backend.entity.MembershipPackage;
import ITSS.Backend.repository.MembershipPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberMembershipPackageService {

    private final MembershipPackageRepository membershipPackageRepository;

    public List<MembershipPackage> getAllPackages() {
        return membershipPackageRepository.findAll();
    }

    public Optional<MembershipPackageDetailResponse> getPackageById(Long id) {
        return membershipPackageRepository.findById(id).map(pkg -> {
            MembershipPackageDetailResponse dto = new MembershipPackageDetailResponse();
            dto.setPackageId(pkg.getPackageId());
            dto.setPackageName(pkg.getPackageName());
            dto.setPackageType(pkg.getPackageType());
            dto.setDuration(pkg.getDuration());
            dto.setPrice(pkg.getPrice());
            dto.setPT(pkg.getPT());
            return dto;
        });
    }




}
