package com.example.security.secure.Admin;

import com.example.security.user.UpdateUserRequest;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AService {

    private final ARepository adminRepository;

    public User getUserByEmail(String email) {
        return adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

   // Update without role change
    public User updateUserWithoutRole(String email, UpdateUserRequest updateRequest) {
        User user = getUserByEmail(email);

        if (updateRequest.getFirstname() != null) {
            user.setFirstname(updateRequest.getFirstname());
        }
        if (updateRequest.getLastname() != null) {
            user.setLastname(updateRequest.getLastname());
        }
        // No role changes here

        return adminRepository.save(user);
    }

    // Update including role change
    public User updateUserWithRole(String email, UpdateUserRequest updateRequest) {
        User user = getUserByEmail(email);

        if (updateRequest.getFirstname() != null) {
            user.setFirstname(updateRequest.getFirstname());
        }
        if (updateRequest.getLastname() != null) {
            user.setLastname(updateRequest.getLastname());
        }
        if (updateRequest.getRole() != null) {
            user.getRoles().clear();
            user.addRole(updateRequest.getRole());
        }

        return adminRepository.save(user);
    }

    public String deleteUserByEmail(String email) {
    User user = adminRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    adminRepository.delete(user);
    return "User with email " + email + " deleted successfully.";
}


    // public List<User> getAllUsers() {
    //     return adminRepository.findAll();
    // }

public List<UserDTO> getAllUserDTOs() {
    return adminRepository.findAll().stream().map(user -> new UserDTO(
            user.getId(),
            user.getFirstname(),
            user.getLastname(),
            user.getEmail(),
            user.getRoles().stream().map(Enum::name).toList(),
            user.getCurrentPlan().name(),
            user.isEnabled(),
            user.getUsername(),
            user.isAccountNonLocked(),
            user.isFreeSubscribed(),
            user.isStandardSubscribed(),
            user.isPremiumSubscribed()
    )).collect(Collectors.toList());
}


    public List<User> getUsersByRole(String roleName) {
        return adminRepository.findByRole(roleName);
    }
}
