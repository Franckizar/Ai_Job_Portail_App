package com.example.security.Other.Job;

import com.example.security.Other.Job.Job.JobStatus;
import com.example.security.Other.JobSkill.CreateJobSkillDto;
import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.Other.JobSkill.JobSkillRepository;
import com.example.security.Other.Skill.Skill;
import com.example.security.Other.Skill.SkillRepository;
import com.example.security.user.Enterprise.Enterprise;
import com.example.security.user.Enterprise.EnterpriseRepository;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerProfile;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerProfileRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.jpa.domain.Specification;
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
    private final EnterpriseRepository enterpriseRepository;
    private final PersonalEmployerProfileRepository personalEmployerProfileRepository;

  public JobResponse createJob(CreateJobRequest request) {
    Job job = buildJobFromRequest(request);

    // Associate Enterprise or PersonalEmployer
    if (request.getEnterpriseId() != null) {
        Enterprise enterprise = enterpriseRepository.findById(request.getEnterpriseId())
                .orElseThrow(() -> new IllegalArgumentException("Enterprise not found with id: " + request.getEnterpriseId()));
        job.setEnterprise(enterprise);
        job.setPersonalEmployer(null);  // clear other association
    } else if (request.getPersonalEmployerId() != null) {
        PersonalEmployerProfile personalEmployer = personalEmployerProfileRepository.findById(request.getPersonalEmployerId())
                .orElseThrow(() -> new IllegalArgumentException("PersonalEmployer not found with id: " + request.getPersonalEmployerId()));
        job.setPersonalEmployer(personalEmployer);
        job.setEnterprise(null);  // clear other association
    } else {
        throw new IllegalArgumentException("Either enterpriseId or personalEmployerId must be provided.");
    }

    job = jobRepository.save(job);
    
    List<JobSkill> jobSkills = saveJobSkills(job, request.getSkills());
    return buildResponse(job, jobSkills);
}


    public List<JobResponse> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream().map(this::buildResponseFromJob).collect(Collectors.toList());
    }

    public JobResponse getJobById(Integer id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Job not found"));
        return buildResponseFromJob(job);
    }

public JobResponse updateJob(Integer jobId, CreateJobRequest request) {
    Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new NoSuchElementException("Job not found"));

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

    // Handle association update
    if (request.getEnterpriseId() != null) {
        Enterprise enterprise = enterpriseRepository.findById(request.getEnterpriseId())
                .orElseThrow(() -> new IllegalArgumentException("Enterprise not found with id: " + request.getEnterpriseId()));
        job.setEnterprise(enterprise);
        job.setPersonalEmployer(null);
    } else if (request.getPersonalEmployerId() != null) {
        PersonalEmployerProfile personalEmployer = personalEmployerProfileRepository.findById(request.getPersonalEmployerId())
                .orElseThrow(() -> new IllegalArgumentException("PersonalEmployer not found with id: " + request.getPersonalEmployerId()));
        job.setPersonalEmployer(personalEmployer);
        job.setEnterprise(null);
    } else {
        // Optionally, you can decide to clear both or keep existing relationship
        // For safety, throw error or keep current associations
        throw new IllegalArgumentException("Either enterpriseId or personalEmployerId must be provided.");
    }

    // Update job skills
    jobSkillRepository.deleteAll(job.getJobSkills());
    List<JobSkill> jobSkills = saveJobSkills(job, request.getSkills());
    job.setJobSkills(jobSkills);

    return buildResponse(job, jobSkills);
}


    public void deleteJob(Integer id) {
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
        List<Integer> skillIds = skillDtos.stream()
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
            // dto.setSkillId(js.getSkill().getId());
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



       public List<Job> findJobsByFilters(JobStatus status, String skill, String city) {
        Specification<Job> spec = Specification.where(JobSpecification.hasStatus(status))
                                              .and(JobSpecification.hasSkill(skill))
                                              .and(JobSpecification.inLocation(city));
        return jobRepository.findAll(spec);
    }
}
