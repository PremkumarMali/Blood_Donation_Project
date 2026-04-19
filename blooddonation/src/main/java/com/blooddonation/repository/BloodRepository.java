package com.blooddonation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.model.Blood;

public interface BloodRepository extends JpaRepository<Blood, Integer> {

}