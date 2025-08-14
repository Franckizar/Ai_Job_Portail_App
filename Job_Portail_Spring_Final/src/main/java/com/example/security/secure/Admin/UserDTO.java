package com.example.security.secure.Admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private List<String> roles;
    private String currentPlan;
    private boolean enabled;
    private String username;
    private boolean accountNonLocked;
    private boolean freeSubscribed;
    private boolean standardSubscribed;
    private boolean premiumSubscribed;
}
