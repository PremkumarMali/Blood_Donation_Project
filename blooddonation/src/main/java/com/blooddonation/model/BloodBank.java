package com.blooddonation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "blood_bank")
public class BloodBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int blood_bank_id;

    private String blood_type;

    private String issues;

    private String orders;

    private int manager_id;

    // Constructors
    public BloodBank() {}

    public BloodBank(int blood_bank_id, String blood_type, String issues, String orders, int manager_id) {
        this.blood_bank_id = blood_bank_id;
        this.blood_type = blood_type;
        this.issues = issues;
        this.orders = orders;
        this.manager_id = manager_id;
    }

    // Getters and Setters

    public int getBlood_bank_id() {
        return blood_bank_id;
    }

    public void setBlood_bank_id(int blood_bank_id) {
        this.blood_bank_id = blood_bank_id;
        }

    public String getBlood_type() {
        return blood_type;
    }

    public void setBlood_type(String blood_type) {
        this.blood_type = blood_type;
    }

    public String getIssues() {
        return issues;
    }

    public void setIssues(String issues) {
        this.issues = issues;
    }

    public String getOrders() {
        return orders;
    }

    public void setOrders(String orders) {
        this.orders = orders;
    }

    public int getManager_id() {
        return manager_id;
    }

    public void setManager_id(int manager_id) {
        this.manager_id = manager_id;
    }
}
