// package com.example.security.user.JobSeeker;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;

// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface JobSeekerRepository extends JpaRepository<JobSeeker, Integer> {
//     // Optional<PatientProfile> findById(Integer id);
//     Optional<JobSeeker> findByUserEmail(String email);
//     @Query("SELECT p.gender, COUNT(p) FROM PatientProfile p GROUP BY p.gender")
//     List<Object[]> countByGender();
    
//     @Query("SELECT COUNT(p) FROM PatientProfile p")
//     long countAllPatients();
    

//     long count();
// }
package com.example.security.user.JobSeeker;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {
    Optional<JobSeeker> findByUserId(Integer userId);
}
