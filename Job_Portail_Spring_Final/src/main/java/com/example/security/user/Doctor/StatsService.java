package com.example.security.user.Doctor;

import org.springframework.stereotype.Service;

import com.example.security.UserRepository;
import com.example.security.user.Nurse.NurseProfileRepository;
import com.example.security.user.Patient.PatientProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final NurseProfileRepository nurseProfileRepository;
    private final DoctorProfileRepository dentistProfileRepository;

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalPatients() {
        return patientProfileRepository.count();
    }

    public long getTotalNurses() {
        return nurseProfileRepository.count();
    }

    public long getTotalDentists() {
        return dentistProfileRepository.count();
    }
}
