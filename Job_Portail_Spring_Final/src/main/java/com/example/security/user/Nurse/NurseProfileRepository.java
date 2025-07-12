package com.example.security.user.Nurse;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface NurseProfileRepository extends JpaRepository<NurseProfile, Integer> {
    Optional<NurseProfile> findByUserId(Integer userId);
    Optional<NurseProfile> findByUserEmail(String email);
    Optional<NurseProfile> findByLicenseNumber(String licenseNumber);
    List<NurseProfile> findByActive(Boolean active);

    long count();
}
