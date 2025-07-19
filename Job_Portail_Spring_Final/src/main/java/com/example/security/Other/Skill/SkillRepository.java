package com.example.security.Other.Skill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {
    // Optional: find by skill name, e.g.:
    // Optional<Skill> findByNameIgnoreCase(String name);
}
