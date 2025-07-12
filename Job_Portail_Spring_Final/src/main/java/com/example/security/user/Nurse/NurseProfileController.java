package com.example.security.user.Nurse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/nurse")
@RequiredArgsConstructor
public class NurseProfileController {

    private final NurseProfileService nurseProfileService;

    // CREATE/UPDATE: Register or update a nurse profile for a user
    @PostMapping("/register-or-update/{userId}")
    public ResponseEntity<NurseProfile> registerOrUpdateNurseProfile(
            @PathVariable Integer userId,
            @RequestBody NurseProfileRequest request) {
        NurseProfile profile = nurseProfileService.registerOrUpdateNurseProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a nurse profile by its ID
    @GetMapping("/{id}")
    public ResponseEntity<NurseProfile> getNurseProfileById(@PathVariable Integer id) {
        NurseProfile profile = nurseProfileService.getNurseProfileById(id);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a nurse profile by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<NurseProfile> getNurseProfileByUserId(@PathVariable Integer userId) {
        NurseProfile profile = nurseProfileService.getNurseProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a nurse profile by email
    @GetMapping("/email/{email}")
    public ResponseEntity<NurseProfile> getNurseProfileByEmail(@PathVariable String email) {
        NurseProfile profile = nurseProfileService.getNurseProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    // READ: Get a nurse profile by license number
    @GetMapping("/license/{licenseNumber}")
    public ResponseEntity<NurseProfile> getNurseProfileByLicense(@PathVariable String licenseNumber) {
        NurseProfile profile = nurseProfileService.getNurseProfileByLicense(licenseNumber);
        return ResponseEntity.ok(profile);
    }

    // READ: Get all nurse profiles
    @GetMapping("/all")
    public ResponseEntity<List<NurseProfile>> getAllNurseProfiles() {
        List<NurseProfile> profiles = nurseProfileService.getAllNurseProfiles();
        return ResponseEntity.ok(profiles);
    }

    // READ: Get all nurse profiles by active status
    @GetMapping("/active/{active}")
    public ResponseEntity<List<NurseProfile>> getNurseProfilesByActive(@PathVariable Boolean active) {
        List<NurseProfile> profiles = nurseProfileService.getNurseProfilesByActive(active);
        return ResponseEntity.ok(profiles);
    }

    // DELETE: Delete a nurse profile by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNurseProfile(@PathVariable Integer id) {
        nurseProfileService.deleteNurseProfile(id);
        return ResponseEntity.noContent().build();
    }
}
