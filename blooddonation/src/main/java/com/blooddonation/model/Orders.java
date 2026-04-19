package com.blooddonation.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "blood_group")
    private String bloodGroup;

    private Integer units;

    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "location")
    private String location;

    @Column(name = "location_id")
    private Integer locationId;

    @Column(name = "contact")
    private String contact;

    @Column(name = "is_emergency")
    private Boolean isEmergency = false;

    // Constructors
    public Orders() {
    }

    public Orders(Integer orderId, Integer userId, String bloodGroup, Integer units, String status, String userName, String location, String contact, Boolean isEmergency) {
        this.orderId = orderId;
        this.userId = userId;
        this.bloodGroup = bloodGroup;
        this.units = units;
        this.status = status;
        this.userName = userName;
        this.location = location;
        this.contact = contact;
        this.isEmergency = isEmergency;
    }

    // Getters and Setters
    public Boolean getIsEmergency() { return isEmergency; }
    public void setIsEmergency(Boolean isEmergency) { this.isEmergency = isEmergency; }

    // Getters and Setters
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getLocationId() { return locationId; }
    public void setLocationId(Integer locationId) { this.locationId = locationId; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }


    // Getters and Setters

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getUnits() {
        return units;
    }

    public void setUnits(Integer units) {
        this.units = units;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}