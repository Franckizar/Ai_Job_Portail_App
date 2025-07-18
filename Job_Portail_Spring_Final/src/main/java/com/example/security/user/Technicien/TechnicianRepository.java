package com.example.security.user.Technicien;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TechnicianRepository extends JpaRepository<Technician, Integer> {
    Optional<Technician> findByUserId(Integer userId);
}
