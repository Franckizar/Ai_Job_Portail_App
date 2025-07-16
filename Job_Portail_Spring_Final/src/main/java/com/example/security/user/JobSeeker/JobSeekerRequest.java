package com.example.security.user.JobSeeker;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerRequest {
    private String fullName;
    private String bio;
    private String resumeUrl;
      private String name;
    private String industry;
    private String description;
    private String website;
    private String logoUrl;
    private String profileImageUrl; 

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    private Double latitude;
    private Double longitude;

}
