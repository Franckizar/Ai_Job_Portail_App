// 7. UserSkillId.java (Composite Key)
package com.example.security.Other.UserSkillId;

import lombok.*;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class UserSkillId implements Serializable {
    private Integer user;
    private Long skill;
}
