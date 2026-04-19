package com.blooddonation.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.model.BloodBankManager;

public interface BloodBankManagerRepository extends JpaRepository<BloodBankManager, Integer> {

}