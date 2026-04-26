package com.blooddonation.repository;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.blooddonation.model.Deliveries;

public interface DeliveriesRepository extends JpaRepository<Deliveries, Integer> {
    List<Deliveries> findByUserId(Integer userId);
    List<Deliveries> findByLocationId(Integer locationId);
}