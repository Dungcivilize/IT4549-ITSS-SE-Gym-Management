package com.example.gym.controller;

import com.example.gym.entity.User;
import com.example.gym.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> user = userService.login(loginRequest.getUserName(), loginRequest.getPassword());

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get()); // Trả về User
        } else {
            return ResponseEntity
                    .status(401)
                    .body("Invalid credentials"); // Trả về String, nhưng kiểu tổng quát là ?
        }
    }

}
