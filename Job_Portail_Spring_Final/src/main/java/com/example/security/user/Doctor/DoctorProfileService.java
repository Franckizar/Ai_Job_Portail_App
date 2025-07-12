package com.example.security.user.Doctor;

import com.example.security.UserRepository;
import com.example.security.user.User;
import com.example.security.user.Nurse.NurseProfileRepository;
import com.example.security.user.Patient.PatientProfileRepository;
import com.example.security.user.adminthings.AdminProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorProfileService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final NurseProfileRepository nurseProfileRepository;
    private final UserRepository userRepository;

    @Transactional
    public DoctorProfile registerOrUpdateDoctorProfile(Integer userId, DoctorProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Remove all other profiles for this user
        adminProfileRepository.findByUserId(userId).ifPresent(adminProfileRepository::delete);
        patientProfileRepository.findById(userId).ifPresent(patientProfileRepository::delete);
        nurseProfileRepository.findByUserId(userId).ifPresent(nurseProfileRepository::delete);

        // Set only DOCTOR role
        user.getRoles().clear();
        user.addRole("DOCTOR");
        userRepository.save(user);

        // Create or update doctor profile
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
            .orElse(DoctorProfile.builder().user(user).build());

        profile.setSpecialization(request.getSpecialization());
        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setHospitalAffiliation(request.getHospitalAffiliation());
        profile.setYearsOfExperience(request.getYearsOfExperience());
        profile.setContactNumber(request.getContactNumber());
        profile.setProfessionalEmail(request.getProfessionalEmail());
        profile.setPhotoUrl(request.getPhotoUrl());
        profile.setOfficeNumber(request.getOfficeNumber());
        profile.setBio(request.getBio());
        profile.setLanguagesSpoken(request.getLanguagesSpoken());
        profile.setAvailability(request.getAvailability());
        profile.setRating(request.getRating());
        profile.setActive(request.getActive() != null ? request.getActive() : true);

        return doctorProfileRepository.save(profile);
    }

    public DoctorProfile getDoctorProfileById(Integer id) {
        return doctorProfileRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found"));
    }

    public DoctorProfile getDoctorProfileByUserId(Integer userId) {
        return doctorProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found for user"));
    }

    public DoctorProfile getDoctorProfileByEmail(String email) {
        return doctorProfileRepository.findByUserEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found for email"));
    }

    public DoctorProfile getDoctorProfileByLicense(String licenseNumber) {
        return doctorProfileRepository.findByLicenseNumber(licenseNumber)
            .orElseThrow(() -> new IllegalArgumentException("Doctor profile not found for license"));
    }

    public List<DoctorProfile> getAllDoctorProfiles() {
        return doctorProfileRepository.findAll();
    }

    public List<DoctorProfile> getDoctorProfilesByActive(Boolean active) {
        return doctorProfileRepository.findByActive(active);
    }

    @Transactional
    public void deleteDoctorProfile(Integer id) {
        doctorProfileRepository.deleteById(id);
    }
}
