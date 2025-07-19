package com.example.security.user.Technicien;

import com.example.security.UserRepository;
import com.example.security.user.Role;
import com.example.security.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnicianService {

    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;

 @Transactional
public Technician create(Integer userId, TechnicianRequest request) {
    // ✅ Step 1: Find the user by ID or throw an error
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

    // ✅ Step 2: Check if the user already has a technician profile
    if (technicianRepository.findByUserId(userId).isPresent()) {
        throw new IllegalArgumentException("Technician profile already exists for this user");
    }

    // ✅ Step 3: Clear existing roles and assign only TECHNICIAN role
    user.getRoles().clear();
    user.addRole(Role.TECHNICIAN);
    userRepository.save(user); // Persist updated roles

    // ✅ Step 4: Create the Technician entity with provided data
    Technician technician = Technician.builder()
            .user(user)
            .department(request.getDepartment())
            .licenseNumber(request.getLicenseNumber())
            .shift(request.getShift())
            .contactNumber(request.getContactNumber())
            .professionalEmail(request.getProfessionalEmail())
            .photoUrl(request.getPhotoUrl())
            .officeNumber(request.getOfficeNumber())
            .yearsOfExperience(request.getYearsOfExperience())
            .bio(request.getBio())
            .languagesSpoken(request.getLanguagesSpoken())
            .active(request.getActive() != null ? request.getActive() : true) // default true
            .technicianLevel(request.getTechnicianLevel())
            .certifications(request.getCertifications())
            .build();

    // ✅ Step 5: Save and return the technician
    return technicianRepository.save(technician);
}


    @Transactional
    public Technician update(Integer userId, TechnicianRequest request) {
        Technician technician = technicianRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Technician not found for user ID " + userId));
        technician.setDepartment(request.getDepartment());
        technician.setLicenseNumber(request.getLicenseNumber());
        technician.setShift(request.getShift());
        technician.setContactNumber(request.getContactNumber());
        technician.setProfessionalEmail(request.getProfessionalEmail());
        technician.setPhotoUrl(request.getPhotoUrl());
        technician.setOfficeNumber(request.getOfficeNumber());
        technician.setYearsOfExperience(request.getYearsOfExperience());
        technician.setBio(request.getBio());
        technician.setLanguagesSpoken(request.getLanguagesSpoken());
        technician.setActive(request.getActive() != null ? request.getActive() : technician.getActive());
        technician.setTechnicianLevel(request.getTechnicianLevel());
        technician.setCertifications(request.getCertifications());
        return technicianRepository.save(technician);
    }

    public Technician getById(Integer id) {
        return technicianRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Technician profile not found"));
    }

    public Technician getByUserId(Integer userId) {
        return technicianRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Technician profile not found"));
    }

    public List<Technician> getAll() {
        return technicianRepository.findAll();
    }

    @Transactional
    public void deleteById(Integer id) {
        technicianRepository.deleteById(id);
    }
}
