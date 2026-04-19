package com.blooddonation.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.blooddonation.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    List<Patient> findByHospitalId(Integer hospitalId);
}