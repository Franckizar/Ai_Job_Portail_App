package com.example.security.user.Technicien;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechnicianRepository extends JpaRepository<Technician, Long> {

    /**
     * Find a technician by their associated user ID.
     * Each technician is linked to one user (One-to-One).
     *
     * @param userId the ID of the associated user
     * @return Optional<Technician>
     */
    Optional<Technician> findByUserId(Integer userId);
}
