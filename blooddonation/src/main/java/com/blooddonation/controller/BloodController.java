package com.blooddonation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.model.Blood;
import com.blooddonation.service.BloodService;

@RestController
@RequestMapping("/api/blood")
@CrossOrigin(origins = "*")
public class BloodController {

    @Autowired
    private BloodService bloodService;

    @GetMapping
    public List<Blood> getAllBlood() {
        return bloodService.getAllBlood();
    }

    @PostMapping
    public Blood addBlood(@RequestBody Blood blood) {
        return bloodService.saveBlood(blood);
    }

    @DeleteMapping("/{id}")
    public void deleteBlood(@PathVariable int id) {
        bloodService.deleteBlood(id);
    }
}