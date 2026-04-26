package com.blooddonation.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.model.BloodBank;

public interface BloodBankRepository extends JpaRepository<BloodBank, Integer> {

}