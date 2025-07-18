package com.example.security.Other.Job;

// package com.example.security.Other.Job;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    /**
     * Create a new job with skills.
     * POST /api/v1/jobs
     */
    // @PostMapping
    // public ResponseEntity<Job> createJob(@RequestBody CreateJobRequest request) {
    //     try {
    //         Job createdJob = jobService.createJob(request);
    //         return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    //     } catch (IllegalArgumentException e) {
    //         // Bad request, for example if skill IDs are invalid
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    //     } catch (Exception e) {
    //         // Generic error
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    //     }
    // }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@RequestBody CreateJobRequest request) {
        try {
            JobResponse createdJob = jobService.createJob(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
