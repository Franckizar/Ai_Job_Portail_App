package com.example.security.user.PersonalEmployerProfile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PersonalEmployerRequest {
    private String displayName;
    private String bio;
    private String profileImageUrl;
    private String contactNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Double latitude;
    private Double longitude;
}
