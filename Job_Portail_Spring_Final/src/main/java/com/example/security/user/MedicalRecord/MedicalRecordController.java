package com.example.security.user.MedicalRecord;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {
    private final MedicalRecordService medicalRecordService;

    // CREATE: Create a new medical record for a patient
    @PostMapping("/create/patient/{patientId}")
    public ResponseEntity<MedicalRecord> createMedicalRecord(
            @PathVariable Integer patientId,
            @RequestBody MedicalRecordRequest request) {
        MedicalRecord record = medicalRecordService.createMedicalRecord(patientId, request);
        return ResponseEntity.ok(record);
    }

    // READ: Get a single medical record by its ID
    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        MedicalRecord record = medicalRecordService.getMedicalRecordById(id);
        return ResponseEntity.ok(record);
    }

    // READ: Get all medical records for a specific patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getRecordsByPatient(@PathVariable Integer patientId) {
        List<MedicalRecord> records = medicalRecordService.getRecordsByPatient(patientId);
        return ResponseEntity.ok(records);
    }

    // READ: Get all medical records created by a specific doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getRecordsByDoctor(@PathVariable Integer doctorId) {
        List<MedicalRecord> records = medicalRecordService.getRecordsByDoctor(doctorId);
        return ResponseEntity.ok(records);
    }

    // READ: Get all medical records for a specific appointment
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<MedicalRecord>> getRecordsByAppointment(@PathVariable Integer appointmentId) {
        List<MedicalRecord> records = medicalRecordService.getRecordsByAppointment(appointmentId);
        return ResponseEntity.ok(records);
    }

    // UPDATE: Update a medical record by its ID
    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecordRequest request) {
        MedicalRecord record = medicalRecordService.updateMedicalRecord(id, request);
        return ResponseEntity.ok(record);
    }

    // DELETE: Delete a medical record by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
    // READ: Get all medical records
@GetMapping("/all")
public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {
    List<MedicalRecord> records = medicalRecordService.getAllMedicalRecords();
    return ResponseEntity.ok(records);
}

}
