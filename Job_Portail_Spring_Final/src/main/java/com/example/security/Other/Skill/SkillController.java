package com.example.security.Other.Skill;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    // Create one skill
    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        Skill created = skillService.createSkill(skill);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Create many skills in one request (array)
    @PostMapping("/batch")
    public ResponseEntity<List<Skill>> createSkills(@RequestBody List<Skill> skills) {
        List<Skill> createdSkills = skillService.createSkills(skills);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSkills);
    }

    // Optional: get all skills
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }
}
