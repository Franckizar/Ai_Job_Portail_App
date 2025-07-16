// 9. JobSkillId.java (Composite Key)
package com.example.security.Other.JobSkillId;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class JobSkillId implements Serializable {
    private Long job;
    private Long skill;
}
