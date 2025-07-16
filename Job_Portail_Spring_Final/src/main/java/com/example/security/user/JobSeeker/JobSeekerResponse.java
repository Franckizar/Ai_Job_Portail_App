package com.example.security.user.JobSeeker;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobSeekerResponse {
    private Long id;
    private Integer userId;
    private String fullName;
    private String bio;
    private String resumeUrl;
    private String profileImageUrl;
}
