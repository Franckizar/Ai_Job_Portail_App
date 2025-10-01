package com.example.security.Other.Application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    // Basic application queries
    List<Application> findByJob_Id(Integer jobId);
    List<Application> findByJobSeeker_Id(Integer jobSeekerId);
    List<Application> findByTechnician_Id(Integer technicianId);
    List<Application> findByStatus(Application.ApplicationStatus status);

    // Count queries
    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = com.example.security.Other.Application.Application.ApplicationStatus.SUBMITTED")
    long countSubmittedApplications();
    
    long countByStatus(Application.ApplicationStatus status);
    
    // Job seeker specific queries
    long countByJobSeeker_IdAndStatus(Integer jobSeekerId, Application.ApplicationStatus status);
    long countByJobSeeker_Id(Integer jobSeekerId);
    List<Application> findByJobSeeker_IdOrderByAppliedAtDesc(Integer jobSeekerId);
    List<Application> findByJobSeeker_IdAndStatus(Integer jobSeekerId, Application.ApplicationStatus status);

    // Technician specific queries
    long countByTechnician_IdAndStatus(Integer technicianId, Application.ApplicationStatus status);
    long countByTechnician_Id(Integer technicianId);
    List<Application> findByTechnician_IdOrderByAppliedAtDesc(Integer technicianId);

    // Enterprise/Employer dashboard queries - FIXED: Using existing statuses
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.enterprise.id = :enterpriseId")
    Long countByEnterpriseId(@Param("enterpriseId") Integer enterpriseId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.personalEmployer.id = :personalEmployerId")
    Long countByPersonalEmployerId(@Param("personalEmployerId") Integer personalEmployerId);

    // FIXED: Use ACCEPTED instead of HIRED, and SHORTLISTED instead of INTERVIEW_SCHEDULED
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.enterprise.id = :enterpriseId AND a.status = 'ACCEPTED'")
    Long countAcceptedByEnterpriseId(@Param("enterpriseId") Integer enterpriseId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.personalEmployer.id = :personalEmployerId AND a.status = 'ACCEPTED'")
    Long countAcceptedByPersonalEmployerId(@Param("personalEmployerId") Integer personalEmployerId);

    // FIXED: Count shortlisted (for interviews) instead of interview scheduled
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.enterprise.id = :enterpriseId AND a.status = 'SHORTLISTED'")
    Long countShortlistedByEnterpriseId(@Param("enterpriseId") Integer enterpriseId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.personalEmployer.id = :personalEmployerId AND a.status = 'SHORTLISTED'")
    Long countShortlistedByPersonalEmployerId(@Param("personalEmployerId") Integer personalEmployerId);

    // FIXED: Count accepted applications this month (using ACCEPTED instead of HIRED)
    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.enterprise.id = :enterpriseId AND a.status = 'ACCEPTED' AND MONTH(a.appliedAt) = MONTH(CURRENT_DATE) AND YEAR(a.appliedAt) = YEAR(CURRENT_DATE)")
    Long countAcceptedThisMonthByEnterpriseId(@Param("enterpriseId") Integer enterpriseId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.personalEmployer.id = :personalEmployerId AND a.status = 'ACCEPTED' AND MONTH(a.appliedAt) = MONTH(CURRENT_DATE) AND YEAR(a.appliedAt) = YEAR(CURRENT_DATE)")
    Long countAcceptedThisMonthByPersonalEmployerId(@Param("personalEmployerId") Integer personalEmployerId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.id = :jobId")
    Long countByJobId(@Param("jobId") Integer jobId);

    // Paginated queries for enterprise/employer dashboard
    @Query("SELECT a FROM Application a WHERE a.job.enterprise.id = :enterpriseId ORDER BY a.appliedAt DESC")
    Page<Application> findRecentApplicationsByEnterpriseId(@Param("enterpriseId") Integer enterpriseId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.personalEmployer.id = :personalEmployerId ORDER BY a.appliedAt DESC")
    Page<Application> findRecentApplicationsByPersonalEmployerId(@Param("personalEmployerId") Integer personalEmployerId, Pageable pageable);

    // Alternative simple derived queries
    List<Application> findByJob_EnterpriseIdOrderByAppliedAtDesc(Integer enterpriseId, Pageable pageable);
    List<Application> findByJob_PersonalEmployerIdOrderByAppliedAtDesc(Integer personalEmployerId, Pageable pageable);
}