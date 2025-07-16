package com.example.security.user.Admin;

import com.example.security.UserRepository;
import com.example.security.user.Role;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;

    /**
     * Register or update an admin profile linked to a user.
     * Clears roles and assigns only ADMIN by default.
     */
    @Transactional
    public Admin registerOrUpdateAdminProfile(Integer userId, AdminRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Clear existing roles and assign ADMIN role
        user.getRoles().clear();
        user.addRole(Role.ADMIN);
        userRepository.save(user);

        // Find existing or initialize new admin profile
        Admin admin = adminRepository.findByUserId(userId)
                .orElse(Admin.builder().user(user).build());

        admin.setFavoriteColor(request.getFavoriteColor());
        admin.setLuckyNumber(request.getLuckyNumber());
        admin.setIsSuperAdmin(request.getIsSuperAdmin());
        admin.setNotes(request.getNotes());

        return adminRepository.save(admin);
    }

    public Admin getAdminProfileById(Integer id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Admin profile not found with ID: " + id));
    }

    public Admin getAdminProfileByUserId(Integer userId) {
        return adminRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Admin profile not found for user ID: " + userId));
    }

    public List<Admin> getAllAdminProfiles() {
        return adminRepository.findAll();
    }

    @Transactional
    public void deleteAdminProfile(Integer id) {
        if (!adminRepository.existsById(id)) {
            throw new IllegalArgumentException("Admin profile not found with ID: " + id);
        }
        adminRepository.deleteById(id);
    }
}
