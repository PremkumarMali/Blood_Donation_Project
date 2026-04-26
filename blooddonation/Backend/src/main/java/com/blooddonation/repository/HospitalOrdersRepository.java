package com.blooddonation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blooddonation.model.HospitalOrders;

public interface HospitalOrdersRepository extends JpaRepository<HospitalOrders, Integer> {

}