package com.blooddonation.repository;

import com.blooddonation.model.DonationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationAppointmentRepository extends JpaRepository<DonationAppointment, Long> {
    List<DonationAppointment> findByUserId(Integer userId);
    List<DonationAppointment> findByLocationId(Integer locationId);
}
