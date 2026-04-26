package com.blooddonation.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "contact")
    private String contact;

    @Column(name = "hospital_id")
    private Integer hospitalId; // optional (for hospital link)

    // ✅ DEFAULT CONSTRUCTOR
    public Patient() {}

    // ✅ PARAMETERIZED CONSTRUCTOR
    public Patient(int id, String name, String bloodGroup, Integer hospitalId, String contact) {
        this.id = id;
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.hospitalId = hospitalId;
        this.contact = contact;
    }

    // ✅ GETTERS & SETTERS

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Integer hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }
}