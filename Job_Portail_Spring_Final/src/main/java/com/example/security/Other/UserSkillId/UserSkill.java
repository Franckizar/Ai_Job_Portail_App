// package com.example.security.Other.UserSkillId;

// import com.example.security.Other.Skill.Skill;
// import com.example.security.Other.UserSkill.UserSkillId;
// import com.example.security.user.User;

// import jakarta.persistence.*;
// import lombok.*;

// @Entity
// @IdClass(UserSkillId.class)
// @Table(name = "user_skills")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class UserSkill {

//     @Id
//     @ManyToOne
//     @JoinColumn(name = "user_id")
//     private User user;

//     @Id
//     @ManyToOne
//     @JoinColumn(name = "skill_id")
//     private Skill skill;

//     private Integer proficiencyLevel;  // example extra attribute
// }
