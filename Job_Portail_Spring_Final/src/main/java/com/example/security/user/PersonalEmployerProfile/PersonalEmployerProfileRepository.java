package com.example.security.user.PersonalEmployerProfile;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PersonalEmployerProfileRepository extends JpaRepository<PersonalEmployerProfile, Integer> {
    Optional<PersonalEmployerProfile> findByUserId(Integer userId);
}
