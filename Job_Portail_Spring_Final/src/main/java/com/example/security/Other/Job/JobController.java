package com.example.security.Other.Job;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/v1/auth/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

   @PostMapping("/create/{ownerType}/{id}")
public ResponseEntity<JobResponse> createJobForOwner(
        @PathVariable String ownerType,
        @PathVariable Integer id,
        @RequestBody CreateJobRequest request) {
    try {
        if ("enterprise".equalsIgnoreCase(ownerType)) {
            request.setEnterpriseId(id);
        } else if ("jobseeker".equalsIgnoreCase(ownerType) || "personalemployer".equalsIgnoreCase(ownerType)) {
            request.setPersonalEmployerId(id);
        } else {
            throw new IllegalArgumentException("Invalid owner type: " + ownerType);
        }
        JobResponse createdJob = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(null);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}


    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJob(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(jobService.getJobById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

@PutMapping("/{id}")
public ResponseEntity<JobResponse> updateJob(@PathVariable Integer id, @RequestBody CreateJobRequest request) {
    try {
        JobResponse updatedJob = jobService.updateJob(id, request);
        return ResponseEntity.ok(updatedJob);
    } catch (NoSuchElementException e) {
        // Job with given id not found
        return ResponseEntity.notFound().build();
    } catch (IllegalArgumentException e) {
        // Missing or invalid enterpriseId/personalEmployerId
        return ResponseEntity.badRequest().body(null);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Integer id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
