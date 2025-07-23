package com.example.security.Other.CV;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CVRepository extends JpaRepository<CV, Long> {

    Optional<CV> findByJobSeekerId(Integer id);
    Optional<CV> findByTechnicianId(Integer id);

}
