package com.example.security.user.Patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientProfileRepository extends JpaRepository<PatientProfile, Integer> {
    // Optional<PatientProfile> findById(Integer id);
    Optional<PatientProfile> findByUserEmail(String email);
    @Query("SELECT p.gender, COUNT(p) FROM PatientProfile p GROUP BY p.gender")
    List<Object[]> countByGender();
    
    @Query("SELECT COUNT(p) FROM PatientProfile p")
    long countAllPatients();
    

    long count();
}
