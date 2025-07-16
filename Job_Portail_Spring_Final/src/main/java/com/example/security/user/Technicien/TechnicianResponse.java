package com.example.security.user.Technicien;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TechnicianResponse {
    
    private Long id;
    private Integer userId;
    private String technicianLevel;
    private String department;
    private String certifications;
}