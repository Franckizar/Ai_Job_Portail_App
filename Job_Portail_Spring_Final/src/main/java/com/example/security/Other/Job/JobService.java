package com.example.security.Other.Job;

import com.example.security.Other.JobSkill.CreateJobSkillDto;
import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.Other.JobSkill.JobSkillRepository;
import com.example.security.Other.Skill.Skill;
import com.example.security.Other.Skill.SkillRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final JobSkillRepository jobSkillRepository;

    public JobResponse createJob(CreateJobRequest request) {
        Job job = buildJobFromRequest(request);
        job = jobRepository.save(job);
        List<JobSkill> jobSkills = saveJobSkills(job, request.getSkills());
        return buildResponse(job, jobSkills);
    }

    public List<JobResponse> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream().map(this::buildResponseFromJob).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));
        return buildResponseFromJob(job);
    }

    public JobResponse updateJob(Long jobId, CreateJobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));

        // Update job fields
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setType(request.getType());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setAddressLine1(request.getAddressLine1());
        job.setAddressLine2(request.getAddressLine2());
        job.setCity(request.getCity());
        job.setState(request.getState());
        job.setPostalCode(request.getPostalCode());
        job.setCountry(request.getCountry());

        // Remove old jobSkills
        jobSkillRepository.deleteAll(job.getJobSkills());

        // Save new jobSkills
        List<JobSkill> jobSkills = saveJobSkills(job, request.getSkills());
        job.setJobSkills(jobSkills);

        return buildResponse(job, jobSkills);
    }

    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));
        jobRepository.delete(job);
    }

    // --------- Private helpers -----------

    private Job buildJobFromRequest(CreateJobRequest request) {
        return Job.builder()
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
    }

    private List<JobSkill> saveJobSkills(Job job, List<CreateJobSkillDto> skillDtos) {
        List<Long> skillIds = skillDtos.stream()
                .map(CreateJobSkillDto::getSkillId)
                .collect(Collectors.toList());

        List<Skill> skills = skillRepository.findAllById(skillIds);
        if (skills.size() != skillDtos.size()) {
            throw new IllegalArgumentException("Invalid skill ID in request");
        }

        List<JobSkill> jobSkills = new ArrayList<>();
        for (CreateJobSkillDto dto : skillDtos) {
            Skill skill = skills.stream()
                    .filter(s -> s.getId().equals(dto.getSkillId()))
                    .findFirst()
                    .orElseThrow();

            JobSkill jobSkill = JobSkill.builder()
                    .job(job)
                    .skill(skill)
                    .required(dto.getRequired() != null ? dto.getRequired() : true)
                    .build();

            jobSkills.add(jobSkill);
        }

        return jobSkillRepository.saveAll(jobSkills);
    }

    private JobResponse buildResponse(Job job, List<JobSkill> jobSkills) {
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

    private JobResponse buildResponseFromJob(Job job) {
        return buildResponse(job, job.getJobSkills());
    }
}
