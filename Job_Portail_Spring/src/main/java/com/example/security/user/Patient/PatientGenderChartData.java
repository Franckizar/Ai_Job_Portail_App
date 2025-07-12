package com.example.security.user.Patient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// NOT an entity, just a POJO for API responses
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientGenderChartData {
    private String name;
    private long count;
    private String fill;

  
}
