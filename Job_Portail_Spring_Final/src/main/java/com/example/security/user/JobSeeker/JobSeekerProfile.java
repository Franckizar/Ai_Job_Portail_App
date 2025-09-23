package com.example.security.user.JobSeeker;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfile {
    private int id;
    private UserDTO user;
    private String fullName;
    private String bio;
    private String resumeUrl;
    private String profileImageUrl;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private int id;
        private String email;
    }
}