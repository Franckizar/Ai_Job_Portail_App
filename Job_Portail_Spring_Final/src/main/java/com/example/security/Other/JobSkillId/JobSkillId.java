package com.example.security.Other.JobSkillId;

import lombok.*;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder

public class JobSkillId implements Serializable {
    private Long job;
    private Long skill;
}
