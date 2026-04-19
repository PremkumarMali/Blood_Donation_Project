package com.blooddonation.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.blooddonation.model.Patient;
import com.blooddonation.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public List<Patient> getPatientsByHospitalId(Integer hospitalId) {
        return patientRepository.findByHospitalId(hospitalId);
    }

    public Patient savePatient(Patient patient) {
        if (patient == null) {
            throw new IllegalArgumentException("Patient cannot be null");
        }
        return patientRepository.save(patient);
    }

    public void deletePatient(int id) {
        patientRepository.deleteById(id);
    }

    public Patient getPatientById(int id) {
        return patientRepository.findById(id).orElse(null);
    }
}