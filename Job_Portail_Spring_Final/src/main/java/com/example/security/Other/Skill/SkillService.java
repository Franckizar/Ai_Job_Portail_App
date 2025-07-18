package com.example.security.Other.Skill;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    // Create a single skill
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    // Create multiple skills at once
    public List<Skill> createSkills(List<Skill> skills) {
        return skillRepository.saveAll(skills);
    }

    // Optional: find all skills
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }
}
