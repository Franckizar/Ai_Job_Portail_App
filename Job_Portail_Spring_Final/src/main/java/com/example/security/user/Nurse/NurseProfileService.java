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
public class NurseProfileService {

    private final NurseProfileRepository nurseProfileRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public NurseProfile registerOrUpdateNurseProfile(Integer userId, NurseProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Remove all other profiles for this user
        adminProfileRepository.findByUserId(userId).ifPresent(adminProfileRepository::delete);
        doctorProfileRepository.findByUserId(userId).ifPresent(doctorProfileRepository::delete);
        patientProfileRepository.findById(userId).ifPresent(patientProfileRepository::delete);

        // Set only NURSE role
        user.getRoles().clear();
        user.addRole("NURSE");
        userRepository.save(user);

        // Create or update nurse profile
        NurseProfile profile = nurseProfileRepository.findByUserId(userId)
            .orElse(NurseProfile.builder().user(user).build());

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

        return nurseProfileRepository.save(profile);
    }

    public NurseProfile getNurseProfileById(Integer id) {
        return nurseProfileRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found"));
    }

    public NurseProfile getNurseProfileByUserId(Integer userId) {
        return nurseProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found for user"));
    }

    public NurseProfile getNurseProfileByEmail(String email) {
        return nurseProfileRepository.findByUserEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found for email"));
    }

    public NurseProfile getNurseProfileByLicense(String licenseNumber) {
        return nurseProfileRepository.findByLicenseNumber(licenseNumber)
            .orElseThrow(() -> new IllegalArgumentException("Nurse profile not found for license"));
    }

    public List<NurseProfile> getAllNurseProfiles() {
        return nurseProfileRepository.findAll();
    }

    public List<NurseProfile> getNurseProfilesByActive(Boolean active) {
        return nurseProfileRepository.findByActive(active);
    }

    @Transactional
    public void deleteNurseProfile(Integer id) {
        nurseProfileRepository.deleteById(id);
    }
}
