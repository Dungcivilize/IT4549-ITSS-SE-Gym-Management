package BE.ITSS.ITSS.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import BE.ITSS.ITSS.Models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.user_name = :username")
    Optional<User> findByUserName(@Param("username") String userName);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}

