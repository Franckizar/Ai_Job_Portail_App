package com.example.security.Other.Application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByJob_Id(Integer jobId);

    List<Application> findByJobSeeker_Id(Integer jobSeekerId);

    List<Application> findByTechnician_Id(Integer technicianId);

    List<Application> findByStatus(Application.ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.status = com.example.security.Other.Application.Application.ApplicationStatus.SUBMITTED")
    long countSubmittedApplications();

    long countByStatus(Application.ApplicationStatus status);
    
    // Count applications by job seeker ID and status
    long countByJobSeeker_IdAndStatus(Integer jobSeekerId, Application.ApplicationStatus status);
    
    // Count total applications by job seeker ID
    long countByJobSeeker_Id(Integer jobSeekerId);
    
    // Find applications by job seeker ID ordered by applied date descending
    List<Application> findByJobSeeker_IdOrderByAppliedAtDesc(Integer jobSeekerId);
    
    // Count applications by technician ID and status
    long countByTechnician_IdAndStatus(Integer technicianId, Application.ApplicationStatus status);
    
    // Count total applications by technician ID
    long countByTechnician_Id(Integer technicianId);
    
    // Find applications by technician ID ordered by applied date descending
    List<Application> findByTechnician_IdOrderByAppliedAtDesc(Integer technicianId);
}