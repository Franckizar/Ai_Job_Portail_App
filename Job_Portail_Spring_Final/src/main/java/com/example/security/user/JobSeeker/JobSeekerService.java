package com.example.security.user.JobSeeker;

import com.example.security.UserRepository;
import com.example.security.user.Role;
import com.example.security.user.User;
import com.example.security.Other.Application.ApplicationService;
import com.example.security.Other.Application.ApplicationDTO;
import com.example.security.Other.Job.JobService;
import com.example.security.Other.Job.JobResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;
    private final UserRepository userRepository;
    private final ApplicationService applicationService;
    private final JobService jobService;

    @Transactional
    public JobSeeker create(Integer userId, JobSeekerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (jobSeekerRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Job seeker profile already exists for this user");
        }

        // Assign role JOB_SEEKER to user
        user.getRoles().clear();
        user.addRole(Role.JOB_SEEKER);
        userRepository.save(user);

        JobSeeker jobSeeker = JobSeeker.builder()
                .user(user)
                .fullName(request.getFullName())
                .bio(request.getBio())
                .resumeUrl(request.getResumeUrl())
                .profileImageUrl(request.getProfileImageUrl())
                .build();

        return jobSeekerRepository.save(jobSeeker);
    }

    @Transactional
    public JobSeeker update(Integer userId, JobSeekerRequest request) {
        JobSeeker profile = jobSeekerRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker profile not found"));

        profile.setFullName(request.getFullName());
        profile.setBio(request.getBio());
        profile.setResumeUrl(request.getResumeUrl());
        profile.setProfileImageUrl(request.getProfileImageUrl());

        return jobSeekerRepository.save(profile);
    }

    public JobSeeker getById(Integer id) {
        return jobSeekerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker profile not found"));
    }

    public JobSeeker getByUserId(Integer userId) {
        return jobSeekerRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker profile not found"));
    }

    public List<JobSeeker> getAll() {
        return jobSeekerRepository.findAll();
    }

    @Transactional
    public void deleteById(Integer id) {
        jobSeekerRepository.deleteById(id);
    }

    public JobSeekerDashboardDTO getDashboardData(Integer userId) {
        JobSeeker jobSeeker = null;
        try {
            jobSeeker = getByUserId(userId);
        } catch (IllegalArgumentException e) {
            // User doesn't have a job seeker profile yet
            // Return dashboard with empty data
            return JobSeekerDashboardDTO.builder()
                    .profile(null)
                    .applications(List.of())
                    .totalApplications(0)
                    .pendingApplications(0)
                    .acceptedApplications(0)
                    .rejectedApplications(0)
                    .recommendedJobs(jobService.getAllJobs().stream()
                            .filter(job -> "ACTIVE".equals(job.getStatus()))
                            .limit(10)
                            .collect(Collectors.toList()))
                    .build();
        }

        // Build profile
        JobSeekerProfile profile = JobSeekerProfile.builder()
                .id(jobSeeker.getId())
                .user(JobSeekerProfile.UserDTO.builder()
                        .id(jobSeeker.getUser().getId())
                        .email(jobSeeker.getUser().getEmail())
                        .build())
                .fullName(jobSeeker.getFullName())
                .bio(jobSeeker.getBio())
                .resumeUrl(jobSeeker.getResumeUrl())
                .profileImageUrl(jobSeeker.getProfileImageUrl())
                .build();

        // Get applications
        List<ApplicationDTO> applications = applicationService.getApplicationsByJobSeekerId(jobSeeker.getId());

        // Calculate stats
        int totalApplications = applications.size();
        int pendingApplications = (int) applications.stream().filter(app -> "SUBMITTED".equals(app.getStatus()) || "REVIEWED".equals(app.getStatus())).count();
        int acceptedApplications = (int) applications.stream().filter(app -> "ACCEPTED".equals(app.getStatus())).count();
        int rejectedApplications = (int) applications.stream().filter(app -> "REJECTED".equals(app.getStatus())).count();

        // Recommended jobs - get all active jobs
        List<JobResponse> recommendedJobs = jobService.getAllJobs().stream()
                .filter(job -> "ACTIVE".equals(job.getStatus()))
                .limit(10)
                .collect(Collectors.toList());

        return JobSeekerDashboardDTO.builder()
                .profile(profile)
                .applications(applications)
                .totalApplications(totalApplications)
                .pendingApplications(pendingApplications)
                .acceptedApplications(acceptedApplications)
                .rejectedApplications(rejectedApplications)
                .recommendedJobs(recommendedJobs)
                .build();
    }
}
