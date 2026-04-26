package com.blooddonation.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "hospital_orders")
public class HospitalOrders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int order_id;

    private int hospital_id;

    private String blood_type;

    private int quantity;

    private LocalDate order_date;

    // Constructors
    public HospitalOrders() {}

    public HospitalOrders(int order_id, int hospital_id, String blood_type, int quantity, LocalDate order_date) {
        this.order_id = order_id;
        this.hospital_id = hospital_id;
        this.blood_type = blood_type;
        this.quantity = quantity;
        this.order_date = order_date;
    }

    // Getters and Setters

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public int getHospital_id() {
        return hospital_id;
    }

    public void setHospital_id(int hospital_id) {
        this.hospital_id = hospital_id;
    }

    public String getBlood_type() {
        return blood_type;
    }

    public void setBlood_type(String blood_type) {
        this.blood_type = blood_type;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getOrder_date() {
        return order_date;
    }

    public void setOrder_date(LocalDate order_date) {
        this.order_date = order_date;
    }
}