package ITSS.Backend.Admin.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import ITSS.Backend.Admin.DTO.MembershipPackageDTO;
import ITSS.Backend.entity.MembershipPackage;
import ITSS.Backend.entity.User;
import ITSS.Backend.repository.MembershipPackageRepository;
import ITSS.Backend.repository.UserRepository;

@Service
public class AdminMembershipPackageService {

    private final MembershipPackageRepository packageRepo;
    private final UserRepository userRepo;

    public AdminMembershipPackageService(MembershipPackageRepository packageRepo, UserRepository userRepo) {
        this.packageRepo = packageRepo;
        this.userRepo = userRepo;
    }

    public List<MembershipPackageDTO> getAllPackages() {
        return packageRepo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MembershipPackageDTO getPackageById(Long id) {
        return packageRepo.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    public MembershipPackageDTO createPackage(MembershipPackageDTO dto) {
        MembershipPackage entity = toEntity(dto);
        MembershipPackage saved = packageRepo.save(entity);
        return toDTO(saved);
    }

    public MembershipPackageDTO updatePackage(Long id, MembershipPackageDTO dto) {
        return packageRepo.findById(id).map(existing -> {
            existing.setPackageName(dto.getPackageName());
            existing.setDuration(dto.getDuration());
            existing.setPrice(dto.getPrice());
            existing.setPT(dto.getPT());
            // set trainers
            List<User> trainers = userRepo.findAllById(dto.getTrainerIds());
            existing.setTrainers(trainers);
            MembershipPackage updated = packageRepo.save(existing);
            return toDTO(updated);
        }).orElse(null);
    }

    public boolean deletePackage(Long id) {
        if (!packageRepo.existsById(id)) return false;
        packageRepo.deleteById(id);
        return true;
    }

    // chuyển từ entity sang dto
    private MembershipPackageDTO toDTO(MembershipPackage entity) {
        MembershipPackageDTO dto = new MembershipPackageDTO();
        dto.setPackageId(entity.getPackageId());
        dto.setPackageName(entity.getPackageName());
        dto.setDuration(entity.getDuration());
        dto.setPrice(entity.getPrice());
        dto.setPT(entity.getPT());
        dto.setTrainerIds(entity.getTrainers()
                .stream().map(User::getUserId).collect(Collectors.toList()));
        return dto;
    }

    // chuyển từ dto sang entity (chỉ tạo mới)
    private MembershipPackage toEntity(MembershipPackageDTO dto) {
        MembershipPackage entity = new MembershipPackage();
        entity.setPackageName(dto.getPackageName());
        entity.setDuration(dto.getDuration());
        entity.setPrice(dto.getPrice());
        entity.setPT(dto.getPT());
        List<User> trainers = userRepo.findAllById(dto.getTrainerIds());
        entity.setTrainers(trainers);
        return entity;
    }
}

