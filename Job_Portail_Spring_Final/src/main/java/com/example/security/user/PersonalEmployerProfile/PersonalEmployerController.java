package com.example.security.user.PersonalEmployerProfile;

import com.example.security.user.User;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/personal-employer")
@RequiredArgsConstructor
public class PersonalEmployerController {

    private final PersonalEmployerService personalEmployerService;
    private final UserRepository userRepository;

    /**
     * Create a new PersonalEmployer profile for specified userId.
     * userId comes as a path variable for association.
     */
    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createPersonalEmployer(
            @PathVariable Integer userId,
            @RequestBody PersonalEmployerRequest request) {

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            PersonalEmployerProfile created = personalEmployerService.create(user, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Get PersonalEmployer profile by id.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPersonalEmployerById(@PathVariable Integer id) {
        try {
            PersonalEmployerProfile profile = personalEmployerService.getById(id);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Get all PersonalEmployer profiles.
     */
    @GetMapping("/all")
    public ResponseEntity<List<PersonalEmployerProfile>> getAllPersonalEmployers() {
        return ResponseEntity.ok(personalEmployerService.getAll());
    }

    /**
     * Update PersonalEmployer profile by id.
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePersonalEmployer(
            @PathVariable Integer id,
            @RequestBody PersonalEmployerRequest request) {
        try {
            PersonalEmployerProfile updated = personalEmployerService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Delete PersonalEmployer profile by id.
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePersonalEmployer(@PathVariable Integer id) {
        try {
            personalEmployerService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
