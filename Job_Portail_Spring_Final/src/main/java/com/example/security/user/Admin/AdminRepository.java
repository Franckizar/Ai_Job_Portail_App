package com.example.security.user.Admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {

    /**
     * Finds an admin profile by the associated user ID.
     *
     * @param userId the unique ID of the user associated with the admin
     * @return Optional containing Admin if found, or empty otherwise
     */
    Optional<Admin> findByUserId(Integer userId);
}
