package com.example.security.user.Prescription;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    // CREATE: Create a new prescription for a patient
    @PostMapping("/create/patient/{patientId}")
    public ResponseEntity<Prescription> createPrescription(
            @PathVariable Integer patientId,
            @RequestBody PrescriptionRequest request) {
        Prescription prescription = prescriptionService.createPrescription(patientId, request);
        return ResponseEntity.ok(prescription);
    }

    // READ: Get a prescription by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Integer id) {
        Prescription prescription = prescriptionService.getPrescriptionById(id);
        return ResponseEntity.ok(prescription);
    }

    // READ: Get all prescriptions for a specific patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatient(@PathVariable Integer patientId) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByPatient(patientId);
        return ResponseEntity.ok(prescriptions);
    }

    // READ: Get all prescriptions written by a specific doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(@PathVariable Integer doctorId) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByDoctor(doctorId);
        return ResponseEntity.ok(prescriptions);
    }

    // READ: Get all prescriptions by status (e.g., 'active', 'completed')
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByStatus(@PathVariable String status) {
        List<Prescription> prescriptions = prescriptionService.getPrescriptionsByStatus(status);
        return ResponseEntity.ok(prescriptions);
    }

    // UPDATE: Update a prescription by its ID
    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(
            @PathVariable Integer id,
            @RequestBody PrescriptionRequest request) {
        Prescription prescription = prescriptionService.updatePrescription(id, request);
        return ResponseEntity.ok(prescription);
    }

    // DELETE: Delete a prescription by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Integer id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}
