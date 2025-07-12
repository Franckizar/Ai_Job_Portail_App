package com.example.security.user.Doctor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Integer> {
    Optional<DoctorProfile> findByUserId(Integer userId);
    Optional<DoctorProfile> findByUserEmail(String email);
    Optional<DoctorProfile> findByLicenseNumber(String licenseNumber);
    List<DoctorProfile> findByActive(Boolean active);
    long count();
}
