package com.example.security.user.adminthings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/admin")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    // CREATE/UPDATE: Register or update an admin profile for a user
    @PostMapping("/register-or-update/{userId}")
    public ResponseEntity<AdminProfile> registerOrUpdateAdminProfile(
            @PathVariable Integer userId,
            @RequestBody AdminProfileRequest request) {
        AdminProfile profile = adminProfileService.registerOrUpdateAdminProfile(userId, request);
        return ResponseEntity.ok(profile);
    }

    // READ: Get an admin profile by its ID
    @GetMapping("/{id}")
    public ResponseEntity<AdminProfile> getAdminProfileById(@PathVariable Integer id) {
        AdminProfile profile = adminProfileService.getAdminProfileById(id);
        return ResponseEntity.ok(profile);
    }

    // READ: Get an admin profile by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<AdminProfile> getAdminProfileByUserId(@PathVariable Integer userId) {
        AdminProfile profile = adminProfileService.getAdminProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    // READ: Get all admin profiles
    @GetMapping("/all")
    public ResponseEntity<List<AdminProfile>> getAllAdminProfiles() {
        List<AdminProfile> profiles = adminProfileService.getAllAdminProfiles();
        return ResponseEntity.ok(profiles);
    }

    // DELETE: Delete an admin profile by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdminProfile(@PathVariable Integer id) {
        adminProfileService.deleteAdminProfile(id);
        return ResponseEntity.noContent().build();
    }
    
}
