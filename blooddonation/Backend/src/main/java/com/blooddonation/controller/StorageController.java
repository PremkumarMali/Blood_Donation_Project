package com.blooddonation.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.blooddonation.model.Storage;
import com.blooddonation.service.StorageService;

@RestController
@RequestMapping("/api/storage")
public class StorageController {

    @Autowired
    private StorageService storageService;

    @GetMapping
    public List<Storage> getAllStorage() {
        return storageService.getAllStorage();
    }

    @GetMapping("/location/{locationId}")
    public List<Storage> getStorageByLocation(@PathVariable Integer locationId) {
        return storageService.getStorageByLocation(locationId);
    }

    @PostMapping
    public Storage addStorage(@RequestBody Storage storage) {
        return storageService.saveStorage(storage);
    }

    @DeleteMapping("/{id}")
    public void deleteStorage(@PathVariable int id) {
        storageService.deleteStorage(id);
    }

    @GetMapping("/check/{bloodType}")
    public List<Storage> checkBlood(@PathVariable String bloodType) {
        return storageService.checkBloodType(bloodType);
    }

    @GetMapping("/check/{bloodType}/location/{locationId}")
    public List<Storage> checkBloodByLocation(@PathVariable String bloodType, @PathVariable Integer locationId) {
        return storageService.checkBloodTypeAndLocation(bloodType, locationId);
    }
}