package com.example.security.Other.Job;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.security.Other.JobSkill.CreateJobSkillDto;
import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.Other.JobSkill.JobSkillRepository;
import com.example.security.Other.Skill.Skill;
import com.example.security.Other.Skill.SkillRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final JobSkillRepository jobSkillRepository;

    public Job createJob(CreateJobRequest request) {
        // Build and save Job entity
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(request.getType())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .status(Job.JobStatus.ACTIVE)
                .build();

        job = jobRepository.save(job);

        // Extract skill IDs
        List<Long> skillIds = request.getSkills().stream()
                .map(CreateJobSkillDto::getSkillId)
                .toList();

        // Fetch Skills and validate existence
        List<Skill> skills = skillRepository.findAllById(skillIds);

        if (skills.size() != skillIds.size()) {
            throw new IllegalArgumentException("Some skill IDs are invalid");
        }

        // Create JobSkill links
        List<JobSkill> jobSkills = new ArrayList<>();
        for (CreateJobSkillDto skillDto : request.getSkills()) {
            Skill skill = skills.stream()
                    .filter(s -> s.getId().equals(skillDto.getSkillId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Skill ID not found: " + skillDto.getSkillId()));

            JobSkill jobSkill = JobSkill.builder()
                    .job(job)
                    .skill(skill)
                    .required(skillDto.getRequired() != null ? skillDto.getRequired() : true)
                    .build();

            jobSkills.add(jobSkill);
        }

        jobSkillRepository.saveAll(jobSkills);

        job.setJobSkills(jobSkills);

        return job;
    }
}
