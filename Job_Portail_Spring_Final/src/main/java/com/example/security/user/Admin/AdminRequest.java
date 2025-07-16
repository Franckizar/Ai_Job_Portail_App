package com.example.security.user.Admin;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminRequest {
    private String favoriteColor;
    private Integer luckyNumber;
    private Boolean isSuperAdmin;
    private String notes;
}
