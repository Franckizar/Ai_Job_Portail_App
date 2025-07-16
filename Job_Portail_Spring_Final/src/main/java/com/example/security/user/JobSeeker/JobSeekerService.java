package com.example.security.user.JobSeeker;

import com.example.security.UserRepository;
import com.example.security.user.Role;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;
    private final UserRepository userRepository;

    @Transactional
    public JobSeeker create(User user, JobSeekerRequest request) {
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
    public JobSeeker update(User user, JobSeekerRequest request) {
        JobSeeker profile = jobSeekerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Job seeker profile not found"));

        profile.setFullName(request.getFullName());
        profile.setBio(request.getBio());
        profile.setResumeUrl(request.getResumeUrl());
        profile.setProfileImageUrl(request.getProfileImageUrl());

        return jobSeekerRepository.save(profile);
    }

    public JobSeeker getByUserId(Integer userId) {
        return jobSeekerRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Job seeker profile not found"));
    }

    public List<JobSeeker> getAll() {
        return jobSeekerRepository.findAll();
    }

    public void deleteById(Long id) {
        jobSeekerRepository.deleteById(id);
    }
}
