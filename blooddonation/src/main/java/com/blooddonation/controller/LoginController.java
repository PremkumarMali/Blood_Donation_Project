package com.blooddonation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User existingUser = userRepository.findByUsernameAndRole(user.getUsername(), user.getRole());

        // 1. Check if user exists
        if (existingUser == null) {
            return ResponseEntity.status(404).body("Error: Username '" + user.getUsername() + "' not found.");
        }

        // 2. Check password
        if (!existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body("Error: Incorrect password.");
        }

        // 3. Check role (safely)
        if (existingUser.getRole() == null || !existingUser.getRole().equalsIgnoreCase(user.getRole())) {
            String dbRole = (existingUser.getRole() == null) ? "null" : existingUser.getRole();
            return ResponseEntity.status(401).body("Error: Role mismatch. Database has '" + dbRole + "' but you logged in as '" + user.getRole() + "'.");
        }

        // ✅ Success
        return ResponseEntity.ok(existingUser);
    }
}