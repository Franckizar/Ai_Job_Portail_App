package com.example.security.user.Nurse;

import com.example.security.UserRepository;
import com.example.security.user.User;
import com.example.security.user.Doctor.DoctorProfileRepository;
import com.example.security.user.Patient.PatientProfileRepository;
import com.example.security.user.adminthings.AdminProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TechnicianRepository TechnicianRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository PatientProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public Technician registerOrUpdateTechnician(Integer userId, TechnicianRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Remove all other profiles for this user
        adminProfileRepository.findByUserId(userId).ifPresent(adminProfileRepository::delete);
        doctorProfileRepository.findByUserId(userId).ifPresent(doctorProfileRepository::delete);
        PatientProfileRepository.findById(userId).ifPresent(PatientProfileRepository::delete);

        // Set only NURSE role
        user.getRoles().clear();
        user.addRole("NURSE");
        userRepository.save(user);

        // Create or update nurse profile
        Technician profile = TechnicianRepository.findByUserId(userId)
            .orElse(Technician.builder().user(user).build());

        profile.setDepartment(request.getDepartment());
        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setShift(request.getShift());
        profile.setContactNumber(request.getContactNumber());
        profile.setProfessionalEmail(request.getProfessionalEmail());
        profile.setPhotoUrl(request.getPhotoUrl());
        profile.setOfficeNumber(request.getOfficeNumber());
        profile.setYearsOfExperience(request.getYearsOfExperience());
        profile.setBio(request.getBio());
        profile.setLanguagesSpoken(request.getLanguagesSpoken());
        profile.setActive(request.getActive() != null ? request.getActive() : true);

        return TechnicianRepository.save(profile);
    }

    public Technician getTechnicianById(Integer id) {
        return TechnicianRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found"));
    }

    public Technician getTechnicianByUserId(Integer userId) {
        return TechnicianRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found for user"));
    }

    public Technician getTechnicianByEmail(String email) {
        return TechnicianRepository.findByUserEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found for email"));
    }

    public Technician getTechnicianByLicense(String licenseNumber) {
        return TechnicianRepository.findByLicenseNumber(licenseNumber)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found for license"));
    }

    public List<Technician> getAllTechnicians() {
        return TechnicianRepository.findAll();
    }

    public List<Technician> getTechniciansByActive(Boolean active) {
        return TechnicianRepository.findByActive(active);
    }

    @Transactional
    public void deleteTechnician(Integer id) {
        TechnicianRepository.deleteById(id);
    }
}
