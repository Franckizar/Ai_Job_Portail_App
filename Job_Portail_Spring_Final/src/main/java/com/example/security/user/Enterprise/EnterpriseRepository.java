package com.example.security.user.Enterprise;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {
    Optional<Enterprise> findByUserId(Integer userId);
    List<Enterprise> findByIndustryContainingIgnoreCase(String industry);
}
