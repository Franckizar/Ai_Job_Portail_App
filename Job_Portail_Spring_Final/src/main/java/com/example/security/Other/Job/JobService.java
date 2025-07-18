package com.example.security.Other.Job;

import com.example.security.Other.JobSkill.CreateJobSkillDto;
import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.Other.JobSkill.JobSkillRepository;
import com.example.security.Other.Skill.Skill;
import com.example.security.Other.Skill.SkillRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final JobSkillRepository jobSkillRepository;

    public JobResponse createJob(CreateJobRequest request) {
        // Step 1: Build and save the Job entity
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

        // Step 2: Extract skill IDs and validate
        List<Long> skillIds = request.getSkills().stream()
                .map(CreateJobSkillDto::getSkillId)
                .collect(Collectors.toList());

        List<Skill> allSkills = skillRepository.findAllById(skillIds);

        if (allSkills.size() != skillIds.size()) {
            throw new IllegalArgumentException("One or more skill IDs are invalid");
        }

        // Step 3: Create JobSkill links
        List<JobSkill> jobSkills = new ArrayList<>();
        for (CreateJobSkillDto skillDto : request.getSkills()) {
            Skill skill = allSkills.stream()
                    .filter(s -> s.getId().equals(skillDto.getSkillId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Skill not found: " + skillDto.getSkillId()));

            JobSkill jobSkill = JobSkill.builder()
                    .job(job)
                    .skill(skill)
                    .required(skillDto.getRequired() != null ? skillDto.getRequired() : true)
                    .build();

            jobSkills.add(jobSkill);
        }

        jobSkillRepository.saveAll(jobSkills);

        // Step 4: Build clean DTO response
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        // response.setType(job.getType());
        // response.setSalaryMin(job.getSalaryMin());
        // response.setSalaryMax(job.getSalaryMax());
        response.setCity(job.getCity());
        response.setCountry(job.getCountry());

        List<JobResponse.JobSkillDto> skillDtos = jobSkills.stream().map(js -> {
            JobResponse.JobSkillDto dto = new JobResponse.JobSkillDto();
            dto.setSkillId(js.getSkill().getId());
            dto.setSkillName(js.getSkill().getName());
            dto.setRequired(js.getRequired());
            return dto;
        }).collect(Collectors.toList());

        response.setSkills(skillDtos);
        return response;
    }
}
