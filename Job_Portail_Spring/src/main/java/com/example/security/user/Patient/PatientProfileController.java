package com.example.security.user.Patient;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/patient")
@RequiredArgsConstructor
public class PatientProfileController {

    private final PatientProfileService patientProfileService;

@PostMapping("/create/{userId}/doctor/{doctorId}")
public ResponseEntity<PatientProfile> createPatientProfile(
        @PathVariable Integer userId,
        @PathVariable Integer doctorId,
        @RequestBody PatientProfileRequest request) {

    PatientProfile profile = patientProfileService.createPatientProfile(userId, doctorId, request);
    return ResponseEntity.ok(profile);
}


    @PutMapping("/update/{userId}")
    public ResponseEntity<PatientProfile> updatePatientProfile(
            @PathVariable Integer userId,
            @RequestBody PatientProfileRequest request) {
        PatientProfile profile = patientProfileService.updatePatientProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

   @GetMapping("/{patientId}")
    public ResponseEntity<PatientProfile> getPatientById(@PathVariable Integer patientId) {
        PatientProfile patient = patientProfileService.getPatientById(patientId);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PatientProfile>> getAllPatientProfiles() {
        return ResponseEntity.ok(patientProfileService.getAllPatientProfiles());
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deletePatientProfile(@PathVariable Integer userId) {
        patientProfileService.deletePatientProfile(userId);
        return ResponseEntity.noContent().build();
    }
     @GetMapping("/patient-gender-count")
    public List<PatientGenderChartData> getPatientGenderCounts() {
        return patientProfileService.getPatientGenderChartData();
    }
}
