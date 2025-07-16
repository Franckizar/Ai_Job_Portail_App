package com.example.security.secure.Admin;

// import com.example.security.user.UpdateUserRequest;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/test")
@RequiredArgsConstructor
public class Controller {

    private final AService adminService;

   // Update without role
    @PutMapping("/update-by-email/no-role")
    public ResponseEntity<User> updateUserWithoutRole(@RequestBody UpdateUserByEmailRequest request) {
        User updatedUser = adminService.updateUserWithoutRole(request.getEmail(), request.getUpdateData());
        return ResponseEntity.ok(updatedUser);
    }

    // Update including role
    @PutMapping("/update-by-email/with-role")
    public ResponseEntity<User> updateUserWithRole(@RequestBody UpdateUserByEmailRequest request) {
        User updatedUser = adminService.updateUserWithRole(request.getEmail(), request.getUpdateData());
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/get-by-email")
    public ResponseEntity<User> getUserByEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = adminService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete-by-email")
public ResponseEntity<String> deleteUserByEmail(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    return ResponseEntity.ok(adminService.deleteUserByEmail(email));
}

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getUsersByRole("ADMIN"));
    }

    @GetMapping("/clients")
    public ResponseEntity<List<User>> getAllClients() {
        return ResponseEntity.ok(adminService.getUsersByRole("USER")); // Change to "CLIENT" if needed
    }
}
