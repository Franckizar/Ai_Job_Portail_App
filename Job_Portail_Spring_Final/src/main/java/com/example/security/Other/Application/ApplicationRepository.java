package com.example.security.Other.Application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// import jakarta.persistence.criteria.CriteriaBuilder.In;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByJob_Id(Integer jobId);

    List<Application> findByJobSeeker_Id(Integer jobSeekerId);

    List<Application> findByTechnician_Id(Integer technicianId);
}
