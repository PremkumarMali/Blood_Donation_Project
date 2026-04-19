package com.blooddonation.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blooddonation.model.Blood;
import com.blooddonation.repository.BloodRepository;

@Service
public class BloodService {

    @Autowired
    private BloodRepository bloodRepository;

    public List<Blood> getAllBlood() {
        return bloodRepository.findAll();
    }

    public Blood saveBlood(Blood blood) {
        if (blood == null) {
            throw new IllegalArgumentException("Blood object cannot be null");
        }
        return bloodRepository.save(blood);
    }

    public void deleteBlood(int id) {
        bloodRepository.deleteById(id);
    }
}