package com.example.security.user.Technicien;

import com.example.security.UserRepository;
import com.example.security.user.Role;
import com.example.security.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicianService {

    private final TechnicianRepository technicianRepository;
    private final UserRepository userRepository;

    public TechnicianService(TechnicianRepository technicianRepository, UserRepository userRepository) {
        this.technicianRepository = technicianRepository;
        this.userRepository = userRepository;
    }

    // ✅ Create technician with default basic values
    @Transactional
    public Technician createDefault(User user) {
        user.getRoles().clear();
        user.addRole(Role.TECHNICIAN);
        userRepository.save(user);

        Technician technician = Technician.builder()
                .user(user)
                .department("General")
                .licenseNumber("LIC-0000")
                .shift("Day")
                .contactNumber("N/A")
                .professionalEmail(user.getEmail()) // default to user email
                .photoUrl("default.png")
                .officeNumber("N/A")
                .yearsOfExperience(0)
                .bio("Default technician bio")
                .languagesSpoken("English")
                .active(true)
                .build();

        return technicianRepository.save(technician);
    }

    // ✅ Create technician from request
    @Transactional
    public Technician create(User user, TechnicianRequest request) {
        user.getRoles().clear();
        user.addRole(Role.TECHNICIAN);
        userRepository.save(user);

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
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return technicianRepository.save(technician);
    }

    // ✅ Update technician by user
    @Transactional
    public Technician update(User user, TechnicianRequest request) {
        Technician technician = technicianRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Technician not found for user ID " + user.getId()));

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

        return technicianRepository.save(technician);
    }

    public Technician getByUserId(Integer userId) {
        return technicianRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Technician not found for user ID " + userId));
    }

    public List<Technician> getAll() {
        return technicianRepository.findAll();
    }

    public Optional<Technician> getById(Long id) {
        return technicianRepository.findById(id);
    }

    @Transactional
    public void deleteById(Long id) {
        technicianRepository.deleteById(id);
    }
}
