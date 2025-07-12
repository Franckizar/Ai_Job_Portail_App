package com.example.security.user.Doctor;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/doctor")
@RequiredArgsConstructor
public class DoctorProfileController {

    private final DoctorProfileService doctorProfileService;

    // CREATE/UPDATE: Register or update a doctor profile for a user
    @PostMapping("/register-or-update/{userId}")
    public ResponseEntity<DoctorProfile> registerOrUpdateDoctorProfile(
            @PathVariable Integer userId,
            @RequestBody DoctorProfileRequest request) {
        DoctorProfile profile = doctorProfileService.registerOrUpdateDoctorProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a doctor profile by its ID
    @GetMapping("/{id}")
    public ResponseEntity<DoctorProfile> getDoctorProfileById(@PathVariable Integer id) {
        DoctorProfile profile = doctorProfileService.getDoctorProfileById(id);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a doctor profile by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<DoctorProfile> getDoctorProfileByUserId(@PathVariable Integer userId) {
        DoctorProfile profile = doctorProfileService.getDoctorProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a doctor profile by email
    @GetMapping("/email/{email}")
    public ResponseEntity<DoctorProfile> getDoctorProfileByEmail(@PathVariable String email) {
        DoctorProfile profile = doctorProfileService.getDoctorProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a doctor profile by license number
    @GetMapping("/license/{licenseNumber}")
    public ResponseEntity<DoctorProfile> getDoctorProfileByLicense(@PathVariable String licenseNumber) {
        DoctorProfile profile = doctorProfileService.getDoctorProfileByLicense(licenseNumber);
        return ResponseEntity.ok(profile);
    }

    // READ: Get all doctor profiles
    @GetMapping("/all")
    public ResponseEntity<List<DoctorProfile>> getAllDoctorProfiles() {
        List<DoctorProfile> profiles = doctorProfileService.getAllDoctorProfiles();
        return ResponseEntity.ok(profiles);
    }

    // READ: Get all doctor profiles by active status
    @GetMapping("/active/{active}")
    public ResponseEntity<List<DoctorProfile>> getDoctorProfilesByActive(@PathVariable Boolean active) {
        List<DoctorProfile> profiles = doctorProfileService.getDoctorProfilesByActive(active);
        return ResponseEntity.ok(profiles);
    }

    // DELETE: Delete a doctor profile by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctorProfile(@PathVariable Integer id) {
        doctorProfileService.deleteDoctorProfile(id);
        return ResponseEntity.noContent().build();
    }
}
