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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (technicianRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Technician profile already exists");
        }
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
                .technicianLevel(request.getTechnicianLevel())
                .certifications(request.getCertifications())
                .build();
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
