package com.blooddonation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "blood_bank_manager")
public class BloodBankManager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int employee_id;

    private String name;

    private String contact_number;

    // Constructors
    public BloodBankManager() {}

    public BloodBankManager(int employee_id, String name, String contact_number) {
        this.employee_id = employee_id;
        this.name = name;
        this.contact_number = contact_number;
    }

    // Getters and Setters
    public int getEmployee_id() {
        return employee_id;
    }

    public void setEmployee_id(int employee_id) {
        this.employee_id = employee_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContact_number() {
        return contact_number;
    }

    public void setContact_number(String contact_number) {
        this.contact_number = contact_number;
    }
}