package com.example.security.user.Prescription;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByPatientId(Integer patientId);
    List<Prescription> findByDoctorId(Integer doctorId);
    List<Prescription> findByStatus(String status);
}
