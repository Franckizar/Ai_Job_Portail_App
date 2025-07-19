package com.example.security.Other.Application;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

     @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody ApplicationRequest request) {
        System.out.println("📥 Received application request...");
        Application application = applicationService.createApplication(request);
        System.out.println("📤 Responding with application ID: " + application.getId());
        return ResponseEntity.ok(application);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Integer id) {
        return applicationService.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable Integer id, @RequestBody Application application) {
        try {
            Application updated = applicationService.updateApplication(id, application);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Integer id) {
        try {
            applicationService.deleteApplication(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-job/{jobId}")
    public ResponseEntity<List<Application>> getByJob(@PathVariable Integer jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(jobId));
    }

    @GetMapping("/by-jobseeker/{jobSeekerId}")
    public ResponseEntity<List<Application>> getByJobSeeker(@PathVariable Integer jobSeekerId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobSeekerId(jobSeekerId));
    }

    @GetMapping("/by-technician/{technicianId}")
    public ResponseEntity<List<Application>> getByTechnician(@PathVariable Integer technicianId) {
        return ResponseEntity.ok(applicationService.getApplicationsByTechnicianId(technicianId));
    }

}
