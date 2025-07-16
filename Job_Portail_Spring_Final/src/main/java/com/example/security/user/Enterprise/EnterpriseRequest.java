package com.example.security.user.Enterprise;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EnterpriseRequest {
    
    private String name;           // formerly "companyName", renamed to match service
    private String industry;
    private String description;
    private String website;
    private String logoUrl;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;

    private Double latitude;
    private Double longitude;
}
