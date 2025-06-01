package ITSS.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ITSS.Backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

} 