package com.blooddonation.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "receptionist")
public class Receptionist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int receptionist_id;

    private String name;

    private int hospital_id;

    private String contact_number;

    // Constructors
    public Receptionist() {}

    public Receptionist(int receptionist_id, String name, int hospital_id, String contact_number) {
        this.receptionist_id = receptionist_id;
        this.name = name;
        this.hospital_id = hospital_id;
        this.contact_number = contact_number;
    }

    // Getters and Setters

    public int getReceptionist_id() {
        return receptionist_id;
    }

    public void setReceptionist_id(int receptionist_id) {
        this.receptionist_id = receptionist_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getHospital_id() {
        return hospital_id;
    }

    public void setHospital_id(int hospital_id) {
        this.hospital_id = hospital_id;
    }

    public String getContact_number() {
        return contact_number;
    }

    public void setContact_number(String contact_number) {
        this.contact_number = contact_number;
    }
}