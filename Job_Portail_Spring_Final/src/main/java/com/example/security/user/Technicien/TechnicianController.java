package com.example.security.user.Technicien;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/technician")
@RequiredArgsConstructor
public class TechnicianController {

    private final TechnicianService technicianService;

    // CREATE
    @PostMapping("/register/{userId}")
    public ResponseEntity<TechnicianResponse> create(
            @PathVariable Integer userId,
            @RequestBody TechnicianRequest request) {
        Technician technician = technicianService.create(userId, request);
        return ResponseEntity.ok(toResponse(technician));
    }

    // UPDATE
    @PutMapping("/update/{userId}")
    public ResponseEntity<TechnicianResponse> update(
            @PathVariable Integer userId,
            @RequestBody TechnicianRequest request) {
        Technician technician = technicianService.update(userId, request);
        return ResponseEntity.ok(toResponse(technician));
    }

    // READ - by profile ID
    @GetMapping("/{id}")
    public ResponseEntity<TechnicianResponse> getById(@PathVariable Integer id) {
        Technician technician = technicianService.getById(id);
        return ResponseEntity.ok(toResponse(technician));
    }

    // READ - by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<TechnicianResponse> getByUserId(@PathVariable Integer userId) {
        Technician technician = technicianService.getByUserId(userId);
        return ResponseEntity.ok(toResponse(technician));
    }

    // READ - all
    @GetMapping("/all")
    public ResponseEntity<List<TechnicianResponse>> getAll() {
        List<Technician> technicians = technicianService.getAll();
        return ResponseEntity.ok(technicians.stream().map(this::toResponse).toList());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        technicianService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Mapping utility
    private TechnicianResponse toResponse(Technician t) {
        return TechnicianResponse.builder()
                .id(t.getId())
                .userId(t.getUser() != null ? t.getUser().getId() : null)
                .technicianLevel(t.getTechnicianLevel())
                .department(t.getDepartment())
                .certifications(t.getCertifications())
                .fullName(t.getFullName())
                .email(t.getEmail())
                .active(t.getActive())
                .build();
    }
}
