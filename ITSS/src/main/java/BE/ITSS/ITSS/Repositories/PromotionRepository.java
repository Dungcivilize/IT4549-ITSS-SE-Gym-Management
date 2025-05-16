package BE.ITSS.ITSS.Repositories;

import BE.ITSS.ITSS.Models.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p WHERE p.status = 'active' AND :today BETWEEN p.startDate AND p.endDate")
    List<Promotion> findValidPromotions(@Param("today") Date today);
}
