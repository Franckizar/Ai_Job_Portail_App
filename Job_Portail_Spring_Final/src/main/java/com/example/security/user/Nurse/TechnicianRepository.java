package com.example.security.user.Nurse;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface TechnicianRepository extends JpaRepository<Technician, Integer> {
    Optional<Technician> findByUserId(Integer userId);
    Optional<Technician> findByUserEmail(String email);
    Optional<Technician> findByLicenseNumber(String licenseNumber);
    List<Technician> findByActive(Boolean active);

    long count();
}
