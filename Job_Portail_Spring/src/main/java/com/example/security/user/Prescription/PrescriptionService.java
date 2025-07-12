package com.example.security.user.Prescription;

import com.example.security.user.Patient.PatientProfileRepository;
import com.example.security.user.Doctor.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;

    @Transactional
    public Prescription createPrescription(Integer patientId, PrescriptionRequest request) {
        var patient = patientProfileRepository.findById(patientId)
            .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        var doctor = doctorProfileRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Prescription prescription = Prescription.builder()
            .patient(patient)
            .doctor(doctor)
            .datePrescribed(request.getDatePrescribed())
            .medicationName(request.getMedicationName())
            .dosage(request.getDosage())
            .frequency(request.getFrequency())
            .duration(request.getDuration())
            .notes(request.getNotes())
            .status(request.getStatus())
            .build();

        return prescriptionRepository.save(prescription);
    }

    public Prescription getPrescriptionById(Integer id) {
        return prescriptionRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Prescription not found"));
    }

    public List<Prescription> getPrescriptionsByPatient(Integer patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(Integer doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Prescription> getPrescriptionsByStatus(String status) {
        return prescriptionRepository.findByStatus(status);
    }

    @Transactional
    public Prescription updatePrescription(Integer id, PrescriptionRequest request) {
        Prescription prescription = getPrescriptionById(id);
        // Update fields as needed
        prescription.setDatePrescribed(request.getDatePrescribed());
        prescription.setMedicationName(request.getMedicationName());
        prescription.setDosage(request.getDosage());
        prescription.setFrequency(request.getFrequency());
        prescription.setDuration(request.getDuration());
        prescription.setNotes(request.getNotes());
        prescription.setStatus(request.getStatus());
        return prescriptionRepository.save(prescription);
    }

    @Transactional
    public void deletePrescription(Integer id) {
        prescriptionRepository.deleteById(id);
    }
}
