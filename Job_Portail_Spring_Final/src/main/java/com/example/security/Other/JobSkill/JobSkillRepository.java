package com.example.security.Other.JobSkill;

// package com.example.security.Other.JobSkill;

import com.example.security.Other.JobSkillId.JobSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill, JobSkillId> {
    // You can add custom queries for JobSkill if required
    // e.g., List<JobSkill> findByJobId(Long jobId);
}
