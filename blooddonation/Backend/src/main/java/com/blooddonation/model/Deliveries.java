package com.blooddonation.model;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "deliveries")
public class Deliveries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer deliveryId;

    private Integer orderId;
    private Integer userId;
    private Integer locationId;
    private String userName;
    private String bloodGroup;
    private Integer units;
    private String location;
    private String contact;
    private String status; // PENDING, OUT_FOR_DELIVERY, DELIVERED
    private LocalDateTime deliveryDate;
    
    @jakarta.persistence.Column(name = "hospital_id")
    private Integer hospitalId;

    private Integer quantity;

    // Constructors
    public Deliveries() {}

    public Deliveries(Integer orderId, Integer userId, Integer locationId, String userName, String bloodGroup, Integer units, String location, String contact, String status) {
        this.orderId = orderId;
        this.userId = userId;
        this.locationId = locationId;
        this.hospitalId = locationId; // Fallback to locationId to satisfy DB constraint
        this.quantity = units; // Map units to quantity to satisfy DB constraint
        this.userName = userName;
        this.bloodGroup = bloodGroup;
        this.units = units;
        this.location = location;
        this.contact = contact;
        this.status = status;
        this.deliveryDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Integer getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Integer deliveryId) { this.deliveryId = deliveryId; }

    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getLocationId() { return locationId; }
    public void setLocationId(Integer locationId) { this.locationId = locationId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public Integer getUnits() { return units; }
    public void setUnits(Integer units) { this.units = units; }


    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }

    public Integer getHospitalId() { return hospitalId; }
    public void setHospitalId(Integer hospitalId) { this.hospitalId = hospitalId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}