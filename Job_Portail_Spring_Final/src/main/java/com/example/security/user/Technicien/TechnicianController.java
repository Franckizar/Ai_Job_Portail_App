// package com.example.security.user.Technicien;

// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;

// @RestController
// @RequestMapping("/api/v1/auth/nurse")
// @RequiredArgsConstructor
// public class TechnicianController {

//     private final TechnicianService TechnicianService;

//     // CREATE/UPDATE: Register or update a nurse profile for a user
//     @PostMapping("/register-or-update/{userId}")
//     public ResponseEntity<Technician> registerOrUpdateTechnician(
//             @PathVariable Integer userId,
//             @RequestBody TechnicianRequest request) {
//         Technician profile = TechnicianService.registerOrUpdateTechnician(userId, request);
//         return ResponseEntity.ok(profile);
//     }

//     // READ: Get a nurse profile by its ID
//     @GetMapping("/{id}")
//     public ResponseEntity<Technician> getTechnicianById(@PathVariable Integer id) {
//         Technician profile = TechnicianService.getTechnicianById(id);
//         return ResponseEntity.ok(profile);
//     }

//     // READ: Get a nurse profile by user ID
//     @GetMapping("/user/{userId}")
//     public ResponseEntity<Technician> getTechnicianByUserId(@PathVariable Integer userId) {
//         Technician profile = TechnicianService.getTechnicianByUserId(userId);
//         return ResponseEntity.ok(profile);
//     }

//     // READ: Get a nurse profile by email
//     @GetMapping("/email/{email}")
//     public ResponseEntity<Technician> getTechnicianByEmail(@PathVariable String email) {
//         Technician profile = TechnicianService.getTechnicianByEmail(email);
//         return ResponseEntity.ok(profile);
//     }

//     // READ: Get a nurse profile by license number
//     @GetMapping("/license/{licenseNumber}")
//     public ResponseEntity<Technician> getTechnicianByLicense(@PathVariable String licenseNumber) {
//         Technician profile = TechnicianService.getTechnicianByLicense(licenseNumber);
//         return ResponseEntity.ok(profile);
//     }

//     // READ: Get all nurse profiles
//     @GetMapping("/all")
//     public ResponseEntity<List<Technician>> getAllTechnicians() {
//         List<Technician> profiles = TechnicianService.getAllTechnicians();
//         return ResponseEntity.ok(profiles);
//     }

//     // READ: Get all nurse profiles by active status
//     @GetMapping("/active/{active}")
//     public ResponseEntity<List<Technician>> getTechniciansByActive(@PathVariable Boolean active) {
//         List<Technician> profiles = TechnicianService.getTechniciansByActive(active);
//         return ResponseEntity.ok(profiles);
//     }

//     // DELETE: Delete a nurse profile by its ID
//     @DeleteMapping("/{id}")
//     public ResponseEntity<Void> deleteTechnician(@PathVariable Integer id) {
//         TechnicianService.deleteTechnician(id);
//         return ResponseEntity.noContent().build();
//     }
// }
