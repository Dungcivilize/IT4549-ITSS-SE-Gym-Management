package com.example.gym.repository;

import com.example.gym.entity.User;
import com.example.gym.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(Role role);
    Optional<User> findByUserNameAndPassword(String userName, String password);

    long countByRole(Role role);
}
