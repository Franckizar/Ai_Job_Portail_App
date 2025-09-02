package com.example.security.Other.AiJobMatch;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.security.Other.Job.Job;
import com.example.security.user.User;

public interface AiJobMatchRepository extends JpaRepository<AiJobMatch, Long> {

    Optional<AiJobMatch> findByUserAndJob(User user, Job jobEntity); 
 @Query("SELECT m FROM AiJobMatch m JOIN FETCH m.job WHERE m.user.id = :userId AND m.matchScore > :matchScore")
    List<AiJobMatch> findByUserIdAndMatchScoreGreaterThan(Integer userId, BigDecimal matchScore);
}