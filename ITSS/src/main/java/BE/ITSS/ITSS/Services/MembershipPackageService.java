package BE.ITSS.ITSS.Services;

import BE.ITSS.ITSS.DTO.PackageResponse;
import BE.ITSS.ITSS.Models.MembershipPackage;
import BE.ITSS.ITSS.Repositories.MembershipPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MembershipPackageService {

    @Autowired
    private MembershipPackageRepository packageRepository;

    public List<PackageResponse> getAllPackages() {
        List<MembershipPackage> packages = packageRepository.findAll();
        return packages.stream()
                .map(p -> new PackageResponse(
                        p.getPackageId(),
                        p.getPackageName(),
                        p.getDuration(),
                        p.getPrice(),
                        p.getPackageType()
                )).collect(Collectors.toList());
    }

    public PackageResponse getPackageById(Long id) {
        MembershipPackage p = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy gói tập"));

        return new PackageResponse(
                p.getPackageId(),
                p.getPackageName(),
                p.getDuration(),
                p.getPrice(),
                p.getPackageType()
        );
    }

}
