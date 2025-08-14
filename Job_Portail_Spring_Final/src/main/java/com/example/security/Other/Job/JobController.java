package com.example.security.Other.Job;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.security.Other.Job.Job.JobStatus;
import com.example.security.Other.Job.Job.JobType;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

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

    

    //     @GetMapping("/filter")
    // public ResponseEntity<List<Job>> getJobs(
    //         @RequestParam(required = false) String status,
    //         @RequestParam(required = false) String skill,
    //         @RequestParam(required = false) String city) {

    //     JobStatus jobStatus = null;
    //     if (status != null) {
    //         try {
    //             jobStatus = JobStatus.valueOf(status.toUpperCase());
    //         } catch (IllegalArgumentException e) {
    //             return ResponseEntity.badRequest().build();
    //         }
    //     }

    //     List<Job> filteredJobs = jobService.findJobsByFilters(jobStatus, skill, city);
    //     return ResponseEntity.ok(filteredJobs);
    // }


    //   @GetMapping("/filter")
    // public ResponseEntity<List<Job>> getJobs(
    //         @RequestParam(required = false) String status,
    //         @RequestParam(required = false) String skill,
    //         @RequestParam(required = false) String city,
    //         @RequestParam(required = false) String type) {

    //     JobStatus jobStatus = null;
    //     if (status != null) {
    //         try {
    //             jobStatus = JobStatus.valueOf(status.toUpperCase());
    //         } catch (IllegalArgumentException e) {
    //             return ResponseEntity.badRequest().build();
    //         }
    //     }

    //     List<JobType> jobTypes = null;
    //     if (type != null && !type.isEmpty()) {
    //         try {
    //             jobTypes = Arrays.stream(type.split(","))
    //                     .map(String::toUpperCase)
    //                     .map(JobType::valueOf)
    //                     .collect(Collectors.toList());
    //         } catch (IllegalArgumentException e) {
    //             return ResponseEntity.badRequest().build();
    //         }
    //     }

    //     List<Job> filteredJobs = jobService.findJobsByFilters(jobStatus, skill, city, jobTypes);
    //     return ResponseEntity.ok(filteredJobs);
@GetMapping("/filter")
public ResponseEntity<List<Job>> getJobs(
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String skill,
    @RequestParam(required = false) String city,
    @RequestParam(required = false) String type
) {
    System.out.println("Received city parameter: " + city); // <-- Add this line

    JobStatus jobStatus = null;
    if (status != null && !status.isEmpty()) {
        try {
            jobStatus = JobStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    List<JobType> jobTypes = null;
    if (type != null && !type.isEmpty()) {
        try {
            jobTypes = Arrays.stream(type.split(","))
                             .map(String::trim)
                             .map(String::toUpperCase)
                             .map(JobType::valueOf)
                             .toList();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    List<Job> filteredJobs = jobService.findJobsByFilters(jobStatus, skill, city, jobTypes);
    return ResponseEntity.ok(filteredJobs);
}



}
