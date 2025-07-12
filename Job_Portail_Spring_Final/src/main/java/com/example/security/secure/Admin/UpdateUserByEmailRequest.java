package com.example.security.secure.Admin;

import com.example.security.user.UpdateUserRequest;
import lombok.Data;

@Data
public class UpdateUserByEmailRequest {
    private String email;
    private UpdateUserRequest updateData;
}
