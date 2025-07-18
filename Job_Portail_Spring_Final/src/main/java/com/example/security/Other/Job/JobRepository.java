package com.example.security.Other.Job;

// import com.example.security.Other.Job.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// package com.example.security.Other.JobSkill;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {}

