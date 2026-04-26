package com.blooddonation.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.blooddonation.model.Orders;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findByUserId(int user_id);
    List<Orders> findByLocationId(Integer locationId);
    List<Orders> findByStatusOrderByApprovedAtDesc(String status);
    List<Orders> findByIsEmergencyAndStatus(Boolean isEmergency, String status);
}