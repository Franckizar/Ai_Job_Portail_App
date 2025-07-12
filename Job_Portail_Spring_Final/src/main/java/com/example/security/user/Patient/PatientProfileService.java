package com.example.security.user.Patient;

import com.example.security.user.User;
import com.example.security.user.Doctor.DoctorProfile;
import com.example.security.user.Doctor.DoctorProfileRepository;
import com.example.security.user.Nurse.TechnicianRepository;
import com.example.security.user.adminthings.AdminProfileRepository;
import com.example.security.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final PatientProfileRepository PatientProfileRepository;
    private final AdminProfileRepository adminProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final TechnicianRepository TechnicianRepository;
    private final UserRepository userRepository;

    @Transactional
    public PatientProfile createPatientProfile(Integer userId, Integer doctorId, PatientProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Remove other profiles
        adminProfileRepository.findByUserId(userId).ifPresent(adminProfileRepository::delete);
        doctorProfileRepository.findByUserId(userId).ifPresent(doctorProfileRepository::delete);
        TechnicianRepository.findByUserId(userId).ifPresent(TechnicianRepository::delete);

        // Set role
        user.getRoles().clear();
        user.addRole("PATIENT");
        userRepository.save(user);

        // Assign doctor
        DoctorProfile doctor = doctorProfileRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found with id: " + doctorId));

        PatientProfile profile = PatientProfile.builder()
                .user(user)
                .doctor(doctor)
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .bloodType(request.getBloodType())
                .allergies(request.getAllergies())
                .occupation(request.getOccupation())
                .maritalStatus(request.getMaritalStatus())
                .currentMedications(request.getCurrentMedications())
                .chronicConditions(request.getChronicConditions())
                .notes(request.getNotes())
                .photoUrl(request.getPhotoUrl())
                .build();

        return PatientProfileRepository.save(profile);
    }

    @Transactional
    public PatientProfile updatePatientProfile(Integer patientId, PatientProfileRequest request) {
        PatientProfile profile = PatientProfileRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient profile not found for id: " + patientId));

        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setAddress(request.getAddress());
        profile.setEmergencyContact(request.getEmergencyContact());
        profile.setBloodType(request.getBloodType());
        profile.setAllergies(request.getAllergies());
        profile.setOccupation(request.getOccupation());
        profile.setMaritalStatus(request.getMaritalStatus());
        profile.setCurrentMedications(request.getCurrentMedications());
        profile.setChronicConditions(request.getChronicConditions());
        profile.setNotes(request.getNotes());
        profile.setPhotoUrl(request.getPhotoUrl());

        return PatientProfileRepository.save(profile);
    }

    @Transactional(readOnly = true)
    public List<PatientProfile> getAllPatientProfiles() {
        return PatientProfileRepository.findAll();
    }

    @Transactional(readOnly = true)
    public PatientProfile getPatientById(Integer patientId) {
        return PatientProfileRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + patientId));
    }

    @Transactional
    public void deletePatientProfile(Integer patientId) {
        PatientProfileRepository.findById(patientId)
                .ifPresent(PatientProfileRepository::delete);
    }

    @Transactional(readOnly = true)
    public List<PatientGenderChartData> getPatientGenderChartData() {
        List<Object[]> genderCounts = PatientProfileRepository.countByGender();
        long total = PatientProfileRepository.count();

        List<PatientGenderChartData> data = new ArrayList<>();
        data.add(new PatientGenderChartData("Total", total, "white"));

        for (Object[] row : genderCounts) {
            String gender = (String) row[0];
            Long count = (Long) row[1];
            if (gender == null) continue;
            if (gender.equalsIgnoreCase("FEMALE")) {
                data.add(new PatientGenderChartData("FEMALE", count, "#FAE27C"));
            } else if (gender.equalsIgnoreCase("MALE")) {
                data.add(new PatientGenderChartData("MALE", count, "#C3EBFA"));
            }
        }
        return data;
    }
}
