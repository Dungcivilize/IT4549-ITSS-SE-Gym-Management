package ITSS.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.MembershipPackage;

@Repository
public interface MembershipPackageRepository extends JpaRepository<MembershipPackage, Long> {

} 