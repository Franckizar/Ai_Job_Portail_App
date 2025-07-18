package com.example.security.user.Enterprise;

import com.example.security.user.User;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/enterprise")
@RequiredArgsConstructor
public class EnterpriseController {

    private final EnterpriseService enterpriseService;
    private final UserRepository userRepository;

    /**
     * Create a new Enterprise profile for specified userId.
     * Note: userId comes as a path variable for association.
     */
    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createEnterprise(
            @PathVariable Integer userId,
            @RequestBody EnterpriseRequest request) {

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            Enterprise created = enterpriseService.create(user, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get Enterprise profile by enterprise id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getEnterpriseById(@PathVariable Integer id) {
        try {
            Enterprise enterprise = enterpriseService.getById(id);
            return ResponseEntity.ok(enterprise);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Get all Enterprise profiles.
     */
    @GetMapping("/all")
    public ResponseEntity<List<Enterprise>> getAllEnterprises() {
        return ResponseEntity.ok(enterpriseService.getAll());
    }

    /**
     * Update Enterprise profile by enterprise id.
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEnterprise(
            @PathVariable Integer id,
            @RequestBody EnterpriseRequest request) {

        try {
            Enterprise updated = enterpriseService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Delete Enterprise profile by id.
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEnterprise(@PathVariable Integer id) {
        try {
            enterpriseService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
