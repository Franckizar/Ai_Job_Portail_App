package com.example.security.user.Patient;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/patient")
@RequiredArgsConstructor
public class PatientProfileController {

    private final PatientProfileService PatientProfileService;

@PostMapping("/create/{userId}/doctor/{doctorId}")
public ResponseEntity<PatientProfile> createPatientProfile(
        @PathVariable Integer userId,
        @PathVariable Integer doctorId,
        @RequestBody PatientProfileRequest request) {

    PatientProfile profile = PatientProfileService.createPatientProfile(userId, doctorId, request);
    return ResponseEntity.ok(profile);
}


    @PutMapping("/update/{userId}")
    public ResponseEntity<PatientProfile> updatePatientProfile(
            @PathVariable Integer userId,
            @RequestBody PatientProfileRequest request) {
        PatientProfile profile = PatientProfileService.updatePatientProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

   @GetMapping("/{patientId}")
    public ResponseEntity<PatientProfile> getPatientById(@PathVariable Integer patientId) {
        PatientProfile patient = PatientProfileService.getPatientById(patientId);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PatientProfile>> getAllPatientProfiles() {
        return ResponseEntity.ok(PatientProfileService.getAllPatientProfiles());
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deletePatientProfile(@PathVariable Integer userId) {
        PatientProfileService.deletePatientProfile(userId);
        return ResponseEntity.noContent().build();
    }
     @GetMapping("/patient-gender-count")
    public List<PatientGenderChartData> getPatientGenderCounts() {
        return PatientProfileService.getPatientGenderChartData();
    }
}
