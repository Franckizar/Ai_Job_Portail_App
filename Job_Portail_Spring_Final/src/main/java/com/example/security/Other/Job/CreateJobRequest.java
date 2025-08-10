  package com.example.security.Other.Job;

  import java.math.BigDecimal;
  import java.util.List;

  import com.example.security.Other.JobSkill.CreateJobSkillDto;

  import lombok.AllArgsConstructor;
  import lombok.Builder;
  import lombok.Data;
  import lombok.NoArgsConstructor;


  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class CreateJobRequest {
      private String title;
      private String description;
      private Job.JobType type;
      private BigDecimal salaryMin;
      private BigDecimal salaryMax;
      private String addressLine1;
      private String addressLine2;
      private String city;
      private String state;
      private String postalCode;
      private String country;
      private List<CreateJobSkillDto> skills;
        private Integer enterpriseId;          // optional
      private Integer personalEmployerId; 
        private String employerName;  
          // private JobType type;    
      // getters/setters
  }