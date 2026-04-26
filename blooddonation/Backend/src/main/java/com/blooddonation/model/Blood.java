package com.blooddonation.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "blood")
public class Blood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int blood_id;

    private String blood_type;

    private double cost;

    private int donor_id;

    // Constructors
    public Blood() {}

    public Blood(int blood_id, String blood_type, double cost, int donor_id) {
        this.blood_id = blood_id;
        this.blood_type = blood_type;
        this.cost = cost;
        this.donor_id = donor_id;
    }

    // Getters and Setters

    public int getBlood_id() {
        return blood_id;
    }

    public void setBlood_id(int blood_id) {
        this.blood_id = blood_id;
    }

    public String getBlood_type() {
        return blood_type;
    }

    public void setBlood_type(String blood_type) {
        this.blood_type = blood_type;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public int getDonor_id() {
        return donor_id;
    }

    public void setDonor_id(int donor_id) {
        this.donor_id = donor_id;

}
}