package com.blooddonation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.blooddonation.model.User;
import com.blooddonation.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        if (userRepository.findByUsernameAndRole(user.getUsername(), user.getRole()) != null) {
            throw new RuntimeException("Error: Username '" + user.getUsername() + "' already exists for role '" + user.getRole() + "'.");
        }

        return userRepository.save(user);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with ID " + id + " not found"));
        
        // Update only the editable fields
        if (userDetails.getUsername() != null) user.setUsername(userDetails.getUsername());
        if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
        if (userDetails.getPhone() != null) user.setPhone(userDetails.getPhone());
        if (userDetails.getAddress() != null) user.setAddress(userDetails.getAddress());
        if (userDetails.getBloodGroup() != null) user.setBloodGroup(userDetails.getBloodGroup());
        if (userDetails.getLocation() != null) user.setLocation(userDetails.getLocation());
        if (userDetails.getContact() != null) user.setContact(userDetails.getContact());

        return userRepository.save(user);
    }
}