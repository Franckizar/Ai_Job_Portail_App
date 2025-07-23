package com.example.security.Other.Job;

import org.springframework.data.jpa.domain.Specification;

import com.example.security.Other.Job.Job.JobStatus;
import com.example.security.Other.JobSkill.JobSkill; // Import JobSkill
import com.example.security.Other.Skill.Skill;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;

public class JobSpecification {

    public static Specification<Job> hasStatus(JobStatus status) {
        return (root, query, cb) -> 
            status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Job> hasSkill(String skillName) {
        return (root, query, cb) -> {
            if (skillName == null || skillName.isEmpty()) return null;
            // Join Job -> jobSkills
            Join<Job, JobSkill> jobSkills = root.join("jobSkills", JoinType.LEFT);
            // Join JobSkill -> Skill
            Join<JobSkill, Skill> skill = jobSkills.join("skill", JoinType.LEFT);
            return cb.like(cb.lower(skill.get("name")), "%" + skillName.toLowerCase() + "%");
        };
    }

    public static Specification<Job> inLocation(String city) {
        return (root, query, cb) -> 
            city == null ? null : cb.equal(cb.lower(root.get("city")), city.toLowerCase());
    }
}





// Summary Table
// Example URL	Purpose
// /api/v1/auth/jobs/filter	All jobs
// /api/v1/auth/jobs/filter?status=ACTIVE	Only active jobs
// /api/v1/auth/jobs/filter?city=Seattle	Jobs in Seattle
// /api/v1/auth/jobs/filter?skill=java	Jobs that need Java skill
// /api/v1/auth/jobs/filter?status=ACTIVE&city=Seattle	Active jobs in Seattle
// /api/v1/auth/jobs/filter?status=CLOSED&skill=python&city=London	Closed Python jobs in London
