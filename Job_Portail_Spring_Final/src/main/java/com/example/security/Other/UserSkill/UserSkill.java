package com.example.security.Other.UserSkill;

import com.example.security.Other.Skill.Skill;
import com.example.security.Other.UserSkillId.UserSkillId;
import com.example.security.user.User;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_skills")
@IdClass(UserSkillId.class)
public class UserSkill {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", referencedColumnName = "skill_id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private SkillLevel level;

    public enum SkillLevel {
        BEGINNER("beginner"),
        INTERMEDIATE("intermediate"),
        EXPERT("expert");

        private final String value;

        SkillLevel(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
