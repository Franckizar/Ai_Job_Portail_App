package com.example.security.user.adminthings;

import com.example.security.UserRepository;
import com.example.security.user.User;
import com.example.security.user.Nurse.TechnicianRepository;
import com.example.security.user.Patient.PatientProfileRepository;
import com.example.security.user.Doctor.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminProfileService {

    private final AdminProfileRepository adminProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository PatientProfileRepository;
    private final TechnicianRepository TechnicianRepository;
    private final UserRepository userRepository;

    @Transactional
    public AdminProfile registerOrUpdateAdminProfile(Integer userId, AdminProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Remove all other profiles for this user
        doctorProfileRepository.findByUserId(userId).ifPresent(doctorProfileRepository::delete);
        PatientProfileRepository.findById(userId).ifPresent(PatientProfileRepository::delete);
        TechnicianRepository.findByUserId(userId).ifPresent(TechnicianRepository::delete);

        // Set only ADMIN role
        user.getRoles().clear();
        user.addRole("ADMIN");
        userRepository.save(user);

        // Create or update admin profile
        AdminProfile profile = adminProfileRepository.findByUserId(userId)
            .orElse(AdminProfile.builder().user(user).build());

        profile.setFavoriteColor(request.getFavoriteColor());
        profile.setLuckyNumber(request.getLuckyNumber());
        profile.setIsSuperAdmin(request.getIsSuperAdmin());
        profile.setNotes(request.getNotes());

        return adminProfileRepository.save(profile);
    }

    public AdminProfile getAdminProfileById(Integer id) {
        return adminProfileRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Admin profile not found"));
    }

    public AdminProfile getAdminProfileByUserId(Integer userId) {
        return adminProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Admin profile not found for user"));
    }

    public List<AdminProfile> getAllAdminProfiles() {
        return adminProfileRepository.findAll();
    }

    @Transactional
    public void deleteAdminProfile(Integer id) {
        adminProfileRepository.deleteById(id);
    }
}
