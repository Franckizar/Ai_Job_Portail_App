package com.example.security.user.Technicien;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TechnicianResponse {

    private Integer id;
    private Integer userId;
    private String technicianLevel;
    private String department;
    private String certifications;
    private String fullName;
    private String email;
    private Boolean active;
}
