package com.example.security.Other.Job;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.security.Other.Application.ApplicationDTO;
import com.example.security.Other.Job.Job.JobStatus;
import com.example.security.Other.Job.Job.JobType;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
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
public ResponseEntity<List<JobResponse>> filterJobs(
        @RequestParam(required = false) Job.JobStatus jobStatus,
        @RequestParam(required = false) String skill,
        @RequestParam(required = false) String city,
        @RequestParam(required = false) List<Job.JobType> jobTypes) {

    List<JobResponse> filteredJobs = jobService.findJobsByFilters(jobStatus, skill, city, jobTypes);
    return ResponseEntity.ok(filteredJobs);
}

@GetMapping("/active/count")
public ResponseEntity<Long> getActiveJobCount() {
    long count = jobService.getActiveJobCount();
    return ResponseEntity.ok(count);
}

//     List<Job> filteredJobs = jobService.findJobsByFilters(jobStatus, skill, city, jobTypes);
//     return ResponseEntity.ok(filteredJobs);
// }



//   @GetMapping("/active/count")
//     public ResponseEntity<Long> getActiveJobCount() {
//         long count = jobService.getActiveJobCount();
//         return ResponseEntity.ok(count);


    // }

@GetMapping("/count/{status}")
public ResponseEntity<Long> getJobCountByStatus(@PathVariable String status) {
    try {
        Job.JobStatus jobStatus = Job.JobStatus.valueOf(status.toUpperCase());
        long count = jobService.countJobsByStatus(jobStatus);
        return ResponseEntity.ok(count);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().build();
    }
// }
}
///////////////////////////////////
// Add these methods to your existing JobController class
// Add these methods to your existing JobController class

@GetMapping("/jobseeker/{jobSeekerId}/application-stats")
public ResponseEntity<Map<String, Long>> getJobSeekerApplicationStats(@PathVariable Integer jobSeekerId) {
    try {
        Map<String, Long> stats = jobService.getApplicationCountsByStatus(jobSeekerId);
        return ResponseEntity.ok(stats);
    } catch (NoSuchElementException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/jobseeker/{jobSeekerId}/recent-applications")
public ResponseEntity<List<ApplicationDTO>> getJobSeekerRecentApplications(
        @PathVariable Integer jobSeekerId,
        @RequestParam(defaultValue = "5") int limit) {
    try {
        List<ApplicationDTO> applications = jobService.getRecentApplications(jobSeekerId, limit);
        return ResponseEntity.ok(applications);
    } catch (NoSuchElementException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/technician/{technicianId}/application-stats")
public ResponseEntity<Map<String, Long>> getTechnicianApplicationStats(@PathVariable Integer technicianId) {
    try {
        Map<String, Long> stats = jobService.getTechnicianApplicationCountsByStatus(technicianId);
        return ResponseEntity.ok(stats);
    } catch (NoSuchElementException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/technician/{technicianId}/recent-applications")
public ResponseEntity<List<ApplicationDTO>> getTechnicianRecentApplications(
        @PathVariable Integer technicianId,
        @RequestParam(defaultValue = "5") int limit) {
    try {
        List<ApplicationDTO> applications = jobService.getRecentTechnicianApplications(technicianId, limit);
        return ResponseEntity.ok(applications);
    } catch (NoSuchElementException e) {
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


///
// In JobController.java - Add these endpoints

// Enterprise Dashboard Endpoints
@GetMapping("/enterprise/{enterpriseId}/stats")
public ResponseEntity<EnterpriseStatsDTO> getEnterpriseStats(@PathVariable Integer enterpriseId) {
    try {
        EnterpriseStatsDTO stats = jobService.getEnterpriseStats(enterpriseId);
        return ResponseEntity.ok(stats);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/enterprise/{enterpriseId}/recent-applications")
public ResponseEntity<List<EnterpriseApplicationDTO>> getEnterpriseRecentApplications(
        @PathVariable Integer enterpriseId,
        @RequestParam(defaultValue = "5") int limit) {
    try {
        List<EnterpriseApplicationDTO> applications = jobService.getRecentApplicationsForEnterprise(enterpriseId, limit);
        return ResponseEntity.ok(applications);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/enterprise/{enterpriseId}/active-jobs")
public ResponseEntity<List<EnterpriseJobDTO>> getEnterpriseActiveJobs(@PathVariable Integer enterpriseId) {
    try {
        List<EnterpriseJobDTO> jobs = jobService.getActiveJobsForEnterprise(enterpriseId);
        return ResponseEntity.ok(jobs);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

// Personal Employer Dashboard Endpoints
@GetMapping("/employer/{employerId}/stats")
public ResponseEntity<EnterpriseStatsDTO> getPersonalEmployerStats(@PathVariable Integer employerId) {
    try {
        EnterpriseStatsDTO stats = jobService.getPersonalEmployerStats(employerId);
        return ResponseEntity.ok(stats);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/employer/{employerId}/recent-applications")
public ResponseEntity<List<EnterpriseApplicationDTO>> getPersonalEmployerRecentApplications(
        @PathVariable Integer employerId,
        @RequestParam(defaultValue = "5") int limit) {
    try {
        List<EnterpriseApplicationDTO> applications = jobService.getRecentApplicationsForPersonalEmployer(employerId, limit);
        return ResponseEntity.ok(applications);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

@GetMapping("/employer/{employerId}/active-jobs")
public ResponseEntity<List<EnterpriseJobDTO>> getPersonalEmployerActiveJobs(@PathVariable Integer employerId) {
    try {
        List<EnterpriseJobDTO> jobs = jobService.getActiveJobsForPersonalEmployer(employerId);
        return ResponseEntity.ok(jobs);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
}
