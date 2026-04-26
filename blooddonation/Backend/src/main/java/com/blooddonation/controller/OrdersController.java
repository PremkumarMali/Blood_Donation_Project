package com.blooddonation.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blooddonation.model.Orders;
import com.blooddonation.model.Storage;
import com.blooddonation.repository.OrdersRepository;
import com.blooddonation.repository.StorageRepository;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private StorageRepository storageRepository;

    @Autowired
    private com.blooddonation.repository.DeliveriesRepository deliveriesRepository;

    // ✅ Create new blood request
    @PostMapping
    public Orders createOrder(@RequestBody Orders order) {
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        return ordersRepository.save(order);
    }

    // ✅ Get all orders
    @GetMapping
    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    // ✅ Get approved request history
    @GetMapping("/approved")
    public List<Orders> getApprovedOrders() {
        return ordersRepository.findByStatusOrderByApprovedAtDesc("APPROVED");
    }

    @GetMapping("/emergency")
    public List<Orders> getEmergencyOrders() {
        return ordersRepository.findByIsEmergencyAndStatus(true, "PENDING");
    }

    // ✅ Get orders by user
    @GetMapping("/user/{id}")
    public List<Orders> getUserOrders(@PathVariable int id) {
        return ordersRepository.findByUserId(id);
    }

    // ✅ Get orders by location (for Blood Bank isolation)
    @GetMapping("/location/{id}")
    public List<Orders> getOrdersByLocation(@PathVariable Integer id) {
        return ordersRepository.findByLocationId(id);
    }

    // ✅ APPROVE ORDER + REDUCE STORAGE + CREATE DELIVERY
    @PutMapping("/{id}/approve")
    public Orders approveOrder(@PathVariable int id, @org.springframework.web.bind.annotation.RequestParam(required = false) Integer adminId) {

        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Only allow approving PENDING orders
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Only pending requests can be approved");
        }

        Integer targetLocationId = order.getLocationId();
        if (targetLocationId == null) {
            targetLocationId = adminId;
        }

        if (targetLocationId == null) {
            throw new RuntimeException("Approval failed: No storage location assigned to this request.");
        }

        List<Storage> storageList =
                storageRepository.findByLocationId(targetLocationId);

        if (storageList.isEmpty()) {
            throw new RuntimeException("No blood stock found at location #" + targetLocationId);
        }

        // Find storage entry with enough units (case-insensitive match)
        Storage storage = storageList.stream()
                .filter(s -> s.getBloodType().trim().equalsIgnoreCase(order.getBloodGroup().trim()))
                .filter(s -> s.getUnits() >= order.getUnits())
                .findFirst()
                .orElse(null);

        if (storage == null) {
             String available = storageList.stream()
                .filter(s -> s.getBloodType().trim().equalsIgnoreCase(order.getBloodGroup().trim()))
                .map(s -> String.valueOf(s.getUnits()))
                .findFirst()
                .orElse("0");
            throw new RuntimeException("Insufficient units for " + order.getBloodGroup() + ". Requested: " + order.getUnits() + ", Available: " + available);
        }

        // 🔥 Reduce blood units
        storage.setUnits(storage.getUnits() - order.getUnits());
        storageRepository.save(storage);

        // 🔥 Update order status and locationId if it was missing
        order.setStatus("APPROVED");
        order.setApprovedAt(LocalDateTime.now());
        if (order.getLocationId() == null) {
            order.setLocationId(targetLocationId);
        }
        Orders savedOrder = ordersRepository.save(order);

        // 🚚 Create Delivery Record
        com.blooddonation.model.Deliveries delivery = new com.blooddonation.model.Deliveries(
            savedOrder.getOrderId(),
            savedOrder.getUserId(),
            savedOrder.getLocationId(),
            savedOrder.getUserName() != null ? savedOrder.getUserName() : ("User #" + savedOrder.getUserId()),
            savedOrder.getBloodGroup(),
            savedOrder.getUnits(),
            savedOrder.getLocation() != null ? savedOrder.getLocation() : "Not specified",
            savedOrder.getContact() != null ? savedOrder.getContact() : "N/A",
            "PENDING"
        );

        deliveriesRepository.save(delivery);

        return savedOrder;
    }



    @PutMapping("/{id}/reject")
    public Orders rejectOrder(@PathVariable int id) {

        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus("REJECTED");
        return ordersRepository.save(order);
    }

    
}