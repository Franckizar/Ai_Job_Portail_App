package com.example.security.user;

// import com.example.security.user.Role;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String firstname;
    private String lastname;
    private Role role;  // Optional: update role if needed
}
  