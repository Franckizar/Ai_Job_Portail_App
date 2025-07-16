// 5. Skill.java
package com.example.security.Other.Skill;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.example.security.Other.JobSkill.JobSkill;
import com.example.security.Other.UserSkill.UserSkill;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    // Relationships
    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserSkill> userSkills;

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<JobSkill> jobSkills;
}
