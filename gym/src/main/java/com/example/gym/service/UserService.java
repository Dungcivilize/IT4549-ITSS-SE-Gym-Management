package com.example.gym.service;

import com.example.gym.entity.User;
import com.example.gym.enums.Role;
import com.example.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userUpdate) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUserName(userUpdate.getUserName());
                    user.setPassword(userUpdate.getPassword());
                    user.setEmail(userUpdate.getEmail());
                    user.setPhone(userUpdate.getPhone());
                    user.setRole(userUpdate.getRole());
                    user.setFullname(userUpdate.getFullname());
                    return userRepository.save(user);
                }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> login(String userName, String password) {
        return userRepository.findByUserNameAndPassword(userName, password);
    }

}
