package com.blooddonation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        // ✅ set default role if null
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        // 🔥 CHECK IF USERNAME + ROLE ALREADY EXISTS
        if (userRepository.findByUsernameAndRole(user.getUsername(), user.getRole()) != null) {
            throw new RuntimeException("Error: Username '" + user.getUsername() + "' already exists for role '" + user.getRole() + "'.");
        }

        return userRepository.save(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}