package com.example.security.user.JobSeeker;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/jobseeker")
@RequiredArgsConstructor
public class JobSeekerController {

    private final JobSeekerService jobSeekerService;

    // CREATE a JobSeeker profile by user ID
    @PostMapping("/register/{userId}")
    public ResponseEntity<JobSeekerResponse> register(
            @PathVariable Integer userId,
            @RequestBody JobSeekerRequest request) {
        JobSeeker profile = jobSeekerService.create(userId, request);
        return ResponseEntity.ok(toResponse(profile));
    }

    // UPDATE a JobSeeker profile by user ID
    @PutMapping("/update/{userId}")
    public ResponseEntity<JobSeekerResponse> update(
            @PathVariable Integer userId,
            @RequestBody JobSeekerRequest request) {
        JobSeeker profile = jobSeekerService.update(userId, request);
        return ResponseEntity.ok(toResponse(profile));
    }

    // READ JobSeeker profile by profile ID
    @GetMapping("/{id}")
    public ResponseEntity<JobSeekerResponse> getById(@PathVariable Integer id) {
        JobSeeker profile = jobSeekerService.getById(id);
        return ResponseEntity.ok(toResponse(profile));
    }

    // READ JobSeeker profile by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<JobSeekerResponse> getByUserId(@PathVariable Integer userId) {
        JobSeeker profile = jobSeekerService.getByUserId(userId);
        return ResponseEntity.ok(toResponse(profile));
    }

    // READ all JobSeeker profiles
    @GetMapping("/all")
    public ResponseEntity<List<JobSeekerResponse>> getAll() {
        List<JobSeeker> profiles = jobSeekerService.getAll();
        return ResponseEntity.ok(profiles.stream().map(this::toResponse).toList());
    }

    // DELETE a JobSeeker profile by profile ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        jobSeekerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Internal helper to map entity to response DTO
    private JobSeekerResponse toResponse(JobSeeker js) {
        return JobSeekerResponse.builder()
                .id(js.getId())
                .userId(js.getUser() != null ? js.getUser().getId() : null)
                .fullName(js.getFullName())
                .bio(js.getBio())
                .resumeUrl(js.getResumeUrl())
                .profileImageUrl(js.getProfileImageUrl())
                .build();
    }
}
