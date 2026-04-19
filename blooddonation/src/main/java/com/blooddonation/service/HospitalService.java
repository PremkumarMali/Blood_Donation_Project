package com.blooddonation.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blooddonation.model.Hospital;
import com.blooddonation.repository.HospitalRepository;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Hospital saveHospital(Hospital hospital) {
        if (hospital == null) {
            throw new IllegalArgumentException("Hospital cannot be null");
        }
        return hospitalRepository.save(hospital);
    }

    public void deleteHospital(int id) {
        hospitalRepository.deleteById(id);
    }
}