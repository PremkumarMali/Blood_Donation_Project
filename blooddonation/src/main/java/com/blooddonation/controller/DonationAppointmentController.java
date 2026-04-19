package com.blooddonation.controller;

import com.blooddonation.model.DonationAppointment;
import com.blooddonation.model.Storage;
import com.blooddonation.model.User;
import com.blooddonation.repository.DonationAppointmentRepository;
import com.blooddonation.repository.StorageRepository;
import com.blooddonation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000")
public class DonationAppointmentController {

    @Autowired
    private DonationAppointmentRepository donationAppointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StorageRepository storageRepository;

    @PostMapping("/book")
    public DonationAppointment bookAppointment(@RequestBody DonationAppointment appointment) {
        if (appointment.getStatus() == null) {
            appointment.setStatus("PENDING");
        }
        return donationAppointmentRepository.save(appointment);
    }

    @GetMapping("/user/{userId}")
    public List<DonationAppointment> getAppointmentsByUser(@PathVariable Integer userId) {
        return donationAppointmentRepository.findByUserId(userId);
    }

    @GetMapping("/location/{locationId}")
    public List<DonationAppointment> getAppointmentsByLocation(@PathVariable Integer locationId) {
        return donationAppointmentRepository.findByLocationId(locationId);
    }

    @PutMapping("/{id}/status")
    public DonationAppointment updateStatus(@PathVariable Long id, @RequestParam String status) {
        if (id == null) {
            throw new IllegalArgumentException("Appointment ID cannot be null");
        }
        DonationAppointment appointment = donationAppointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        String oldStatus = appointment.getStatus();
        appointment.setStatus(status);
        
        // 🔥 Update storage when donation is completed
        // 🔥 Update storage and Reward User when donation is completed
        if ("COMPLETED".equals(status) && !"COMPLETED".equals(oldStatus)) {
            Integer locId = appointment.getLocationId();
            String bloodType = appointment.getBloodType();
            
            // 1. Update Storage (Local to this Hospital/Bank)
            List<Storage> storageList = storageRepository.findByBloodTypeAndLocationId(bloodType, locId);
            Storage storage;
            if (!storageList.isEmpty()) {
                storage = storageList.get(0);
                storage.setUnits(storage.getUnits() + 1);
            } else {
                storage = new Storage();
                storage.setBloodType(bloodType);
                storage.setLocationId(locId);
                storage.setUnits(1);
                
                // Get location name from user table
                Integer targetLocId = locId;
                if (targetLocId != null) {
                    User locationUser = userRepository.findById(targetLocId).orElse(null);
                    if (locationUser != null) {
                        String name = (locationUser.getRole().equalsIgnoreCase("HOSPITAL")) 
                            ? locationUser.getHospitalName() : locationUser.getBankName();
                        storage.setLocation(name != null ? name : locationUser.getUsername());
                    }
                }
            }
            storageRepository.save(storage);

            // 2. Reward Donor (Points & Badges)
            Integer donorId = appointment.getUserId();
            if (donorId != null) {
                User donor = userRepository.findById(donorId).orElse(null);
                if (donor != null) {
                    int newPoints = (donor.getPoints() == null ? 0 : donor.getPoints()) + 10;
                    donor.setPoints(newPoints);
                    
                    String currentBadges = donor.getBadges() == null ? "" : donor.getBadges();
                    if (newPoints >= 10 && !currentBadges.contains("Newcomer")) {
                        currentBadges = currentBadges.isEmpty() ? "Newcomer" : currentBadges + ",Newcomer";
                    }
                    if (newPoints >= 50 && !currentBadges.contains("Life Saver")) {
                        currentBadges = currentBadges + ",Life Saver";
                    }
                    donor.setBadges(currentBadges);
                    userRepository.save(donor);
                }
            }
        }
        
        return donationAppointmentRepository.save(appointment);
    }

    @GetMapping("/locations")
    public List<Map<String, Object>> getDonationLocations() {
        List<User> hospitals = userRepository.findByRole("HOSPITAL");
        List<User> bloodBanks = userRepository.findByRole("BLOOD_BANK");
        List<User> admins = userRepository.findByRole("ADMIN"); // Admin is also Blood Bank Manager
        
        List<Map<String, Object>> locations = new ArrayList<>();
        
        for (User u : hospitals) {
            addLocation(locations, u, "Hospital");
        }
        for (User u : bloodBanks) {
            addLocation(locations, u, "Blood Bank");
        }
        for (User u : admins) {
            addLocation(locations, u, "Blood Bank");
        }
        
        return locations;
    }

    private void addLocation(List<Map<String, Object>> list, User u, String type) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", u.getUser_id());
        String name = "";
        if ("Hospital".equals(type)) {
            name = (u.getHospitalName() != null && !u.getHospitalName().isEmpty()) ? u.getHospitalName() : u.getUsername();
        } else {
            name = (u.getBankName() != null && !u.getBankName().isEmpty()) ? u.getBankName() : u.getUsername();
        }
        map.put("name", name + " (" + type + ")");
        list.add(map);
    }
}
