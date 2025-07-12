package com.example.security.user.Doctor;

import org.springframework.stereotype.Service;

import com.example.security.UserRepository;
import com.example.security.user.Nurse.TechnicianRepository;
import com.example.security.user.Patient.PatientProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final UserRepository userRepository;
    private final PatientProfileRepository PatientProfileRepository;
    private final TechnicianRepository TechnicianRepository;
    private final DoctorProfileRepository dentistProfileRepository;

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalPatients() {
        return PatientProfileRepository.count();
    }

    public long getTotalNurses() {
        return TechnicianRepository.count();
    }

    public long getTotalDentists() {
        return dentistProfileRepository.count();
    }
}
