package com.example.security.Other.Job;

import java.util.List;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Integer>, JpaSpecificationExecutor<Job> {

    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = com.example.security.Other.Job.Job.JobStatus.ACTIVE")
    long countActiveJobs();
      long countByStatus(Job.JobStatus status);



      //////////////////
       // Enterprise/Employer specific methods
    List<Job> findByEnterpriseIdAndStatus(Integer enterpriseId, Job.JobStatus status);
    List<Job> findByPersonalEmployerIdAndStatus(Integer personalEmployerId, Job.JobStatus status);
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.enterprise.id = :enterpriseId AND j.status = 'ACTIVE'")
    Long countActiveJobsByEnterprise(@Param("enterpriseId") Integer enterpriseId);
    
    @Query("SELECT COUNT(j) FROM Job j WHERE j.personalEmployer.id = :personalEmployerId AND j.status = 'ACTIVE'")
    Long countActiveJobsByPersonalEmployer(@Param("personalEmployerId") Integer personalEmployerId);
    
    @Query("SELECT j FROM Job j WHERE j.enterprise.id = :enterpriseId ORDER BY j.createdAt DESC")
    List<Job> findRecentJobsByEnterprise(@Param("enterpriseId") Integer enterpriseId, Pageable pageable);
    
    @Query("SELECT j FROM Job j WHERE j.personalEmployer.id = :personalEmployerId ORDER BY j.createdAt DESC")
    List<Job> findRecentJobsByPersonalEmployer(@Param("personalEmployerId") Integer personalEmployerId, Pageable pageable);

}