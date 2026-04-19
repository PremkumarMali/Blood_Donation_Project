package com.blooddonation.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.model.Donor;

public interface DonorRepository extends JpaRepository<Donor, Integer> {

    // Find donors by blood type
    List<Donor> findByBloodType(String bloodType);

}