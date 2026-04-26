package com.blooddonation.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.blooddonation.model.Storage;
import com.blooddonation.repository.StorageRepository;

@Service
public class StorageService {

    @Autowired
    private StorageRepository storageRepository;

    public List<Storage> getAllStorage() {
        return storageRepository.findAll();
    }

    public List<Storage> getStorageByLocation(Integer locationId) {
        return storageRepository.findByLocationId(locationId);
    }

    public Storage saveStorage(Storage storage) {
        if (storage == null) {
            throw new IllegalArgumentException("Storage object cannot be null");
        }
        return storageRepository.save(storage);
    }

    public void deleteStorage(int id) {
        storageRepository.deleteById(id);
    }

    public List<Storage> checkBloodType(String bloodType) {
        return storageRepository.findByBloodType(bloodType);
    }

    public List<Storage> checkBloodTypeAndLocation(String bloodType, Integer locationId) {
        return storageRepository.findByBloodTypeAndLocationId(bloodType, locationId);
    }
}