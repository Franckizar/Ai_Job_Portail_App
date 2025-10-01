package com.example.security.Other.Job;

import com.example.security.Other.Application.Application;
import com.example.security.Other.Application.ApplicationDTO;
import com.example.security.Other.Application.ApplicationRepository;
import com.example.security.Other.Job.category.JobCategory;
import com.example.security.Other.Job.category.JobCategoryRepository;
import com.example.security.Other.JobSkill.CreateJobSkillDto;
import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.Other.JobSkill.JobSkillRepository;
import com.example.security.Other.Skill.Skill;
import com.example.security.Other.Skill.SkillRepository;
import com.example.security.user.User;
import com.example.security.user.Enterprise.Enterprise;
import com.example.security.user.Enterprise.EnterpriseRepository;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerProfile;
import com.example.security.user.PersonalEmployerProfile.PersonalEmployerProfileRepository;
import org.springframework.data.domain.PageRequest;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private final JobCategoryRepository jobCategoryRepository;
    private final ApplicationRepository applicationRepository;

    // ---------------- CREATE JOB ----------------
    public JobResponse createJob(CreateJobRequest request) {
        Job job = buildJobFromRequest(request);
        associateEmployer(job, request.getEnterpriseId(), request.getPersonalEmployerId());

        if (request.getCategoryId() != null) {
            JobCategory category = jobCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            job.setCategory(category);
        }

        job = jobRepository.save(job);

        List<JobSkill> jobSkills = saveJobSkills(job, request.getSkills());
        return buildResponse(job, jobSkills);
    }

    

    // ---------------- GET ALL JOBS ----------------
    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::buildResponseFromJob)
                .collect(Collectors.toList());
    }

    // ---------------- GET JOB BY ID ----------------
    public JobResponse getJobById(Integer id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Job not found"));
        return buildResponseFromJob(job);
    }

    // ---------------- UPDATE JOB ----------------
    public JobResponse updateJob(Integer jobId, CreateJobRequest request) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NoSuchElementException("Job not found"));

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

        associateEmployer(job, request.getEnterpriseId(), request.getPersonalEmployerId());

        if (request.getCategoryId() != null) {
            JobCategory category = jobCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            job.setCategory(category);
        } else {
            job.setCategory(null);
        }

        jobSkillRepository.deleteAll(job.getJobSkills());
        List<JobSkill> jobSkills = saveJobSkills(job, request.getSkills());
        job.setJobSkills(jobSkills);

        return buildResponse(job, jobSkills);
    }

    // ---------------- DELETE JOB ----------------
    public void deleteJob(Integer id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Job not found"));
        jobRepository.delete(job);
    }

    // ---------------- HELPERS ----------------
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

    private void associateEmployer(Job job, Integer enterpriseId, Integer personalEmployerId) {
        if (enterpriseId != null) {
            Enterprise enterprise = enterpriseRepository.findById(enterpriseId)
                    .orElseThrow(() -> new IllegalArgumentException("Enterprise not found"));
            job.setEnterprise(enterprise);
            job.setPersonalEmployer(null);
        } else if (personalEmployerId != null) {
            PersonalEmployerProfile personalEmployer = personalEmployerProfileRepository.findById(personalEmployerId)
                    .orElseThrow(() -> new IllegalArgumentException("PersonalEmployer not found"));
            job.setPersonalEmployer(personalEmployer);
            job.setEnterprise(null);
        } else {
            throw new IllegalArgumentException("Either enterpriseId or personalEmployerId must be provided");
        }
    }

    private List<JobSkill> saveJobSkills(Job job, List<CreateJobSkillDto> skillDtos) {
        List<Integer> skillIds = skillDtos.stream().map(CreateJobSkillDto::getSkillId).collect(Collectors.toList());
        List<Skill> skills = skillRepository.findAllById(skillIds);

        if (skills.size() != skillDtos.size()) {
            throw new IllegalArgumentException("Invalid skill ID in request");
        }

        List<JobSkill> jobSkills = new ArrayList<>();
        for (CreateJobSkillDto dto : skillDtos) {
            Skill skill = skills.stream().filter(s -> s.getId().equals(dto.getSkillId())).findFirst().orElseThrow();
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
        response.setType(job.getType());
        response.setSalaryMin(job.getSalaryMin() != null ? job.getSalaryMin().intValue() : null);
        response.setSalaryMax(job.getSalaryMax() != null ? job.getSalaryMax().intValue() : null);
        response.setCity(job.getCity());
        response.setState(job.getState());
        response.setPostalCode(job.getPostalCode());
        response.setCountry(job.getCountry());
        response.setAddressLine1(job.getAddressLine1());
        response.setAddressLine2(job.getAddressLine2());
        response.setStatus(job.getStatus());
        response.setCreatedAt(job.getCreatedAt() != null ? job.getCreatedAt().toString() : null);

        // Employer
        if (job.getEnterprise() != null) {
            response.setEnterpriseId(job.getEnterprise().getId());
            response.setEmployerName(job.getEnterprise().getName());
        } else if (job.getPersonalEmployer() != null && job.getPersonalEmployer().getUser() != null) {
            response.setPersonalEmployerId(job.getPersonalEmployer().getId());
            User user = job.getPersonalEmployer().getUser();
            response.setEmployerName(user.getFirstname() + " " + user.getLastname());
        }

        // Category
        if (job.getCategory() != null) {
            JobResponse.JobCategoryDto categoryDto = new JobResponse.JobCategoryDto();
            categoryDto.setId(job.getCategory().getId());
            categoryDto.setName(job.getCategory().getName());
            categoryDto.setDescription(job.getCategory().getDescription());
            response.setCategory(categoryDto);
        }

        // Skills
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

    public List<JobResponse> findJobsByFilters(Job.JobStatus status, String skill, String city, List<Job.JobType> types) {
    Specification<Job> spec = Specification.where(JobSpecification.hasStatus(status))
            .and(JobSpecification.hasSkill(skill))
            .and(JobSpecification.inLocation(city));

    if (types != null && !types.isEmpty()) {
        spec = spec.and(JobSpecification.hasAnyType(types));
    }

    List<Job> jobs = jobRepository.findAll(spec);

    // Convert to JobResponse DTOs
    return jobs.stream()
            .map(this::buildResponseFromJob)
            .collect(Collectors.toList());
}


// ---------------- COUNT ACTIVE JOBS ----------------
public long getActiveJobCount() {
    return jobRepository.countByStatus(Job.JobStatus.ACTIVE);
}

public long countJobsByStatus(Job.JobStatus status) {
    if (status == null) {
        throw new IllegalArgumentException("Status parameter is required");
    }
    return jobRepository.countByStatus(status);
}





/////////////////////////
// Add these methods to your existing JobService class

// Get application counts by status for job seeker
public Map<String, Long> getApplicationCountsByStatus(Integer jobSeekerId) {
    Map<String, Long> counts = new HashMap<>();
    
    counts.put("total", applicationRepository.countByJobSeeker_Id(jobSeekerId));
    counts.put("pending", applicationRepository.countByJobSeeker_IdAndStatus(jobSeekerId, Application.ApplicationStatus.PENDING));
    counts.put("accepted", applicationRepository.countByJobSeeker_IdAndStatus(jobSeekerId, Application.ApplicationStatus.ACCEPTED));
    counts.put("rejected", applicationRepository.countByJobSeeker_IdAndStatus(jobSeekerId, Application.ApplicationStatus.REJECTED));
    
    return counts;
}

// Get application counts by status for technician
public Map<String, Long> getTechnicianApplicationCountsByStatus(Integer technicianId) {
    Map<String, Long> counts = new HashMap<>();
    
    counts.put("total", applicationRepository.countByTechnician_Id(technicianId));
    counts.put("pending", applicationRepository.countByTechnician_IdAndStatus(technicianId, Application.ApplicationStatus.PENDING));
    counts.put("accepted", applicationRepository.countByTechnician_IdAndStatus(technicianId, Application.ApplicationStatus.ACCEPTED));
    counts.put("rejected", applicationRepository.countByTechnician_IdAndStatus(technicianId, Application.ApplicationStatus.REJECTED));
    
    return counts;
}

// Get recent applications for job seeker
public List<ApplicationDTO> getRecentApplications(Integer jobSeekerId, int limit) {
    return applicationRepository.findByJobSeeker_IdOrderByAppliedAtDesc(jobSeekerId)
            .stream()
            .limit(limit)
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

// Get recent applications for technician
public List<ApplicationDTO> getRecentTechnicianApplications(Integer technicianId, int limit) {
    return applicationRepository.findByTechnician_IdOrderByAppliedAtDesc(technicianId)
            .stream()
            .limit(limit)
            .map(this::convertToDTO)
            .collect(Collectors.toList());
}

private ApplicationDTO convertToDTO(Application application) {
    ApplicationDTO dto = new ApplicationDTO();
    dto.setId(application.getId());
    dto.setResumeUrl(application.getResumeUrl());
    dto.setPortfolioUrl(application.getPortfolioUrl());
    dto.setStatus(application.getStatus().toString());
    dto.setAppliedAt(application.getAppliedAt());
    dto.setCoverLetter(application.getCoverLetter());
    dto.setJobId(application.getJob().getId());
    
    // Set job seeker or technician ID
    if (application.getJobSeeker() != null) {
        dto.setJobSeekerId(application.getJobSeeker().getId());
    }
    if (application.getTechnician() != null) {
        dto.setTechnicianId(application.getTechnician().getId());
    }
    
    // Set job details
if (application.getJob() != null) {
    dto.setJobTitle(application.getJob().getTitle());
    dto.setJobLocation(application.getJob().getCity() + ", " + application.getJob().getState());
    dto.setJobType(application.getJob().getType() != null 
        ? application.getJob().getType().toString() 
        : null);

    // BigDecimal to Double conversion with null safety
    dto.setSalaryMin(application.getJob().getSalaryMin() != null 
        ? application.getJob().getSalaryMin().doubleValue() 
        : null);
    dto.setSalaryMax(application.getJob().getSalaryMax() != null 
        ? application.getJob().getSalaryMax().doubleValue() 
        : null);

    // Set company name based on employer type, null safe
    if (application.getJob().getEnterprise() != null) {
        dto.setCompanyName(application.getJob().getEnterprise().getName());
    } else if (application.getJob().getPersonalEmployer() != null &&
               application.getJob().getPersonalEmployer().getUser() != null) {
        String firstName = application.getJob().getPersonalEmployer().getUser().getFirstname();
        String lastName = application.getJob().getPersonalEmployer().getUser().getLastname();
        dto.setCompanyName((firstName != null ? firstName : "") + " " + 
            (lastName != null ? lastName : ""));
    }
}

    
    return dto;
}

//////
// In JobService.java



// Enterprise Dashboard Statistics
public EnterpriseStatsDTO getEnterpriseStats(Integer enterpriseId) {
    Long activeJobs = jobRepository.countActiveJobsByEnterprise(enterpriseId);
    Long totalApplications = applicationRepository.countByEnterpriseId(enterpriseId);
Long interviewsScheduled = applicationRepository.countShortlistedByEnterpriseId(enterpriseId);
Long hiredThisMonth = applicationRepository.countAcceptedThisMonthByEnterpriseId(enterpriseId);

// And for personal employer:
// Long interviewsScheduled = applicationRepository.countShortlistedByPersonalEmployerId(personalEmployerId);
// Long hiredThisMonth = applicationRepository.countAcceptedThisMonthByPersonalEmployerId(personalEmployerId);
    
    // For demo - replace with actual implementations
    Long profileViews = 245L;
    Integer responseRate = 85;
    LocalDate premiumUntil = LocalDate.now().plusMonths(6);
    
    return EnterpriseStatsDTO.builder()
            .activeJobs(activeJobs)
            .totalApplications(totalApplications)
            .interviewsScheduled(interviewsScheduled)
            .hiredThisMonth(hiredThisMonth)
            .profileViews(profileViews)
            .responseRate(responseRate)
            .premiumUntil(premiumUntil)
            .build();
}

public EnterpriseStatsDTO getPersonalEmployerStats(Integer personalEmployerId) {
    Long activeJobs = jobRepository.countActiveJobsByPersonalEmployer(personalEmployerId);
    Long totalApplications = applicationRepository.countByPersonalEmployerId(personalEmployerId);
    Long interviewsScheduled = applicationRepository.countShortlistedByPersonalEmployerId(personalEmployerId); // FIXED
    Long hiredThisMonth = applicationRepository.countAcceptedThisMonthByPersonalEmployerId(personalEmployerId); // FIXED
    
    // For demo - you can replace these with actual implementations when available
    Long profileViews = 120L;
    Integer responseRate = 78;
    
    return EnterpriseStatsDTO.builder()
            .activeJobs(activeJobs)
            .totalApplications(totalApplications)
            .interviewsScheduled(interviewsScheduled)
            .hiredThisMonth(hiredThisMonth)
            .profileViews(profileViews)
            .responseRate(responseRate)
            .premiumUntil(null)
            .build();
}

// Recent Applications for Enterprise/Employer
public List<EnterpriseApplicationDTO> getRecentApplicationsForEnterprise(Integer enterpriseId, int limit) {
    return applicationRepository.findRecentApplicationsByEnterpriseId(enterpriseId, PageRequest.of(0, limit))
            .stream()
            .map(this::convertToEnterpriseApplicationDTO)
            .collect(Collectors.toList());
}

public List<EnterpriseApplicationDTO> getRecentApplicationsForPersonalEmployer(Integer personalEmployerId, int limit) {
    return applicationRepository.findRecentApplicationsByPersonalEmployerId(personalEmployerId, PageRequest.of(0, limit))
            .stream()
            .map(this::convertToEnterpriseApplicationDTO)
            .collect(Collectors.toList());
}

// Helper conversion method
private EnterpriseApplicationDTO convertToEnterpriseApplicationDTO(Application application) {
    String candidateName = "";
    String experience = "";
    List<String> skills = new ArrayList<>();
    
    if (application.getJobSeeker() != null && application.getJobSeeker().getUser() != null) {
        candidateName = application.getJobSeeker().getUser().getFirstname() + " " + 
                       application.getJobSeeker().getUser().getLastname();
        experience = "5 years";
        skills = Arrays.asList("React", "TypeScript", "Node.js");
    }
    
    return EnterpriseApplicationDTO.builder()
            .id(application.getId())
            .candidateName(candidateName)
            .jobTitle(application.getJob().getTitle())
            .status(application.getStatus().toString())
            .applicationDate(application.getAppliedAt())
            .matchScore(92)
            .experience(experience)
            .skills(skills)
            .build();
}



// In JobService.java - Add these methods

// Get active jobs for enterprise
public List<EnterpriseJobDTO> getActiveJobsForEnterprise(Integer enterpriseId) {
    List<Job> jobs = jobRepository.findByEnterpriseIdAndStatus(enterpriseId, Job.JobStatus.ACTIVE);
    return jobs.stream()
            .map(this::convertToEnterpriseJobDTO)
            .collect(Collectors.toList());
}

// Get active jobs for personal employer
public List<EnterpriseJobDTO> getActiveJobsForPersonalEmployer(Integer personalEmployerId) {
    List<Job> jobs = jobRepository.findByPersonalEmployerIdAndStatus(personalEmployerId, Job.JobStatus.ACTIVE);
    return jobs.stream()
            .map(this::convertToEnterpriseJobDTO)
            .collect(Collectors.toList());
}

// Helper method to convert Job to EnterpriseJobDTO
private EnterpriseJobDTO convertToEnterpriseJobDTO(Job job) {
    Long applicationCount = applicationRepository.countByJobId(job.getId());
    
    return EnterpriseJobDTO.builder()
            .id(job.getId())
            .title(job.getTitle())
            .department(job.getCategory() != null ? job.getCategory().getName() : "General")
            .applicationCount(applicationCount)
            .status(job.getStatus().toString())
            .postedDate(job.getCreatedAt())
            .type(job.getType().toString())
            .location(formatLocation(job.getCity(), job.getState()))
            .salary(formatSalary(job.getSalaryMin(), job.getSalaryMax()))
            .build();
}

// Helper method to format location
private String formatLocation(String city, String state) {
    if (city == null && state == null) return "Remote";
    if (city == null) return state;
    if (state == null) return city;
    return city + ", " + state;
}

// Helper method to format salary
private String formatSalary(BigDecimal min, BigDecimal max) {
    if (min == null && max == null) return "Negotiable";
    if (min == null) return "Up to " + max.intValue();
    if (max == null) return "From " + min.intValue();
    return min.intValue() + " - " + max.intValue();
}
}
