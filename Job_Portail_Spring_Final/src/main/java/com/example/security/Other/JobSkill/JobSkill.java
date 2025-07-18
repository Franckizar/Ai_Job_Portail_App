package com.example.security.Other.JobSkill;

import com.example.security.Other.Job.Job;
import com.example.security.Other.Skill.Skill;
// import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.security.Other.JobSkillId.JobSkillId;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "job_skills")
@IdClass(JobSkillId.class)
public class JobSkill {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    // @JsonBackReference
    // @JsonIgnore
    @JoinColumn(name = "job_id", referencedColumnName = "job_id")
    private Job job;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    // @JsonIgnore
    @JoinColumn(name = "skill_id", referencedColumnName = "skill_id")
    private Skill skill;

    @Column(nullable = false)
    @Builder.Default
    private Boolean required = true;
}
