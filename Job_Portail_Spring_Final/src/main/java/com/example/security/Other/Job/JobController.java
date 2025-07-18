// package com.example.security.Other.Job;

// import com.example.security.Other.Job.Job;;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/v1/jobs")
// @RequiredArgsConstructor
// public class JobController {

//     private final JobService jobService;

//     @PostMapping
//     public ResponseEntity<Job> createJob(@RequestBody CreateJobRequest request) {
//         try {
//             Job createdJob = jobService.createJob(request);
//             return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body(null);
//         }
//     }
// }
