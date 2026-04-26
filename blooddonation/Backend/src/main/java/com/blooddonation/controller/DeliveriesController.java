package com.blooddonation.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.blooddonation.model.Deliveries;
import com.blooddonation.repository.DeliveriesRepository;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveriesController {

    @Autowired
    private DeliveriesRepository deliveriesRepository;

    @GetMapping
    public List<Deliveries> getAllDeliveries() {
        return deliveriesRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Deliveries> getUserDeliveries(@PathVariable int userId) {
        return deliveriesRepository.findByUserId(userId);
    }

    @GetMapping("/location/{locationId}")
    public List<Deliveries> getDeliveriesByLocation(@PathVariable Integer locationId) {
        return deliveriesRepository.findByLocationId(locationId);
    }

    @PutMapping("/{id}/status")
    public Deliveries updateStatus(@PathVariable int id, @RequestBody String status) {
        Deliveries delivery = deliveriesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        
        // Remove quotes if present (standard when sending raw string via axios)
        String cleanStatus = status.replace("\"", "");
        delivery.setStatus(cleanStatus);
        return deliveriesRepository.save(delivery);
    }
}
