package com.example.security.user.Admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * ✅ Register or update an Admin profile for a user ID.
     */
    @PostMapping("/register-or-update/{userId}")
    public ResponseEntity<Admin> registerOrUpdateAdmin(
            @PathVariable Integer userId,
            @RequestBody AdminRequest request) {
        Admin admin = adminService.registerOrUpdateAdminProfile(userId, request);
        return ResponseEntity.ok(admin);
    }

    /**
     * ✅ Get Admin profile by admin ID (primary key of Admin entity).
     */
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Integer id) {
        Admin admin = adminService.getAdminProfileById(id);
        return ResponseEntity.ok(admin);
    }

    /**
     * ✅ Get Admin profile by user ID.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Admin> getAdminByUserId(@PathVariable Integer userId) {
        Admin admin = adminService.getAdminProfileByUserId(userId);
        return ResponseEntity.ok(admin);
    }

    /**
     * ✅ Get a list of all Admin profiles.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdminProfiles();
        return ResponseEntity.ok(admins);
    }

    /**
     * ✅ Delete Admin profile by admin ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Integer id) {
        adminService.deleteAdminProfile(id);
        return ResponseEntity.noContent().build();
    }
}
