package com.example.security.user.Invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByPatientId(Integer patientId);
    List<Invoice> findByAppointmentId(Integer appointmentId);
    List<Invoice> findByStatus(String status);
}
