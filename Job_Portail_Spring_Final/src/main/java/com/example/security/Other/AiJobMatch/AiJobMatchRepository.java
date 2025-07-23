package com.example.security.Other.AiJobMatch;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.security.Other.Job.Job;
import com.example.security.user.User;

public interface AiJobMatchRepository extends JpaRepository<AiJobMatch, Long> {

    Optional<AiJobMatch> findByUserAndJob(User user, Job jobEntity); }