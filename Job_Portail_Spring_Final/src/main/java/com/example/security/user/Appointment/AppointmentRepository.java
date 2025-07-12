package com.example.security.user.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByDoctorId(Integer doctorId);
    List<Appointment> findByPatientId(Integer patientId);
    
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);


    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = :status")
    List<Appointment> findByDoctorAndStatus(
        @Param("doctorId") Integer doctorId, 
        @Param("status") String status
    );
}
