package com.blooddonation.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.blooddonation.model.Storage;

public interface StorageRepository extends JpaRepository<Storage, Integer> {
    List<Storage> findByBloodType(String bloodType);
    List<Storage> findByLocationId(Integer locationId);
    List<Storage> findByBloodTypeAndLocationId(String bloodType, Integer locationId);
}