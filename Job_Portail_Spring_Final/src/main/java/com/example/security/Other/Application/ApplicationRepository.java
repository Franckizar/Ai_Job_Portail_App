package com.example.security.Other.Application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

// import jakarta.persistence.criteria.CriteriaBuilder.In;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByJob_Id(Integer jobId);

    List<Application> findByJobSeeker_Id(Integer jobSeekerId);

    List<Application> findByTechnician_Id(Integer technicianId);

     List<Application> findByStatus(Application.ApplicationStatus status);
    //    List<Application> findByStatus(Application.ApplicationStatus status);

     @Query("SELECT COUNT(a) FROM Application a WHERE a.status = com.example.security.Other.Application.Application.ApplicationStatus.SUBMITTED")
    long countSubmittedApplications();
// }

}
