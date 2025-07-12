package com.example.security.user.adminthings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminProfileRepository extends JpaRepository<AdminProfile, Integer> {
    Optional<AdminProfile> findByUserId(Integer userId);
}
