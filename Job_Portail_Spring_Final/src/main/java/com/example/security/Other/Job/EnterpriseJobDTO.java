package com.example.security.Other.Job;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;



// EnterpriseJobDTO.java
@Data
@Builder
public class EnterpriseJobDTO {
    private Integer id;
    private String title;
    private String department;
    private Long applicationCount;
    private String status;
    private LocalDateTime postedDate;
    private String type;
    private String location;
    private String salary;
}