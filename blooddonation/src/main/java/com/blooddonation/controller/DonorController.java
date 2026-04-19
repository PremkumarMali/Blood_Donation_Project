package com.blooddonation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.model.Donor;
import com.blooddonation.model.Storage;
import com.blooddonation.repository.DonorRepository;
import com.blooddonation.repository.StorageRepository;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "http://localhost:3000")
public class DonorController {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private StorageRepository storageRepository;

    // Get all donors
    @GetMapping
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    // Add donor
    @PostMapping
    public Donor addDonor(@RequestBody Donor donor) {
        if (donor == null) {
            throw new IllegalArgumentException("Donor cannot be null");
        }

        Donor savedDonor = donorRepository.save(donor);

        List<Storage> storageList = storageRepository.findByBloodType(savedDonor.getBloodType());

        if (!storageList.isEmpty()) {
            Storage storage = storageList.get(0);
            storage.setUnits(storage.getUnits() + 1);
            storageRepository.save(storage);
        }

        return savedDonor;
    }

    // Find donors by blood group
    @GetMapping("/blood/{type}")
    public List<Donor> getDonorsByBlood(@PathVariable("type") String type) {
        return donorRepository.findByBloodType(type);
    }

    
}