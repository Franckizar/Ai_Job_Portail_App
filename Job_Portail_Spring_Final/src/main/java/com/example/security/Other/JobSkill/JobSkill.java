package com.example.security.Other.JobSkill;



import com.example.security.Other.Job.Job;
import com.example.security.Other.JobSkillId.JobSkillId;
import com.example.security.Other.Skill.Skill;

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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", referencedColumnName = "job_id")
    private Job job;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", referencedColumnName = "skill_id")
    private Skill skill;

    @Builder.Default
    private Boolean required = true;
}
