package com.blooddonation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.model.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, Integer> {

}