package com.example.security.Other.Job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Integer>, JpaSpecificationExecutor<Job> {

    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = com.example.security.Other.Job.Job.JobStatus.ACTIVE")
    long countActiveJobs();
      long countByStatus(Job.JobStatus status);
}