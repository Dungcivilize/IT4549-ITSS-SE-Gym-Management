package BE.ITSS.ITSS.Repositories;

import BE.ITSS.ITSS.Models.MembershipPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface MembershipPackageRepository extends JpaRepository<MembershipPackage, Long> {

    @Query(value = "SELECT * FROM MembershipPackage WHERE package_id = :id", nativeQuery = true)
    Optional<MembershipPackage> findByIdNative(@Param("id") Long id);
}

