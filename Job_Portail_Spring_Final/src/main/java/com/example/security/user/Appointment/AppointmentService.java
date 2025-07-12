package com.example.security.user.Appointment;

import com.example.security.user.Patient.PatientProfile;
import com.example.security.user.Patient.PatientProfileRepository;
import com.example.security.user.Doctor.DoctorProfile;
import com.example.security.user.Doctor.DoctorProfileRepository;
import com.example.security.user.MedicalRecord.MedicalRecord;
import com.example.security.user.Nurse.NurseProfile;
import com.example.security.user.Nurse.NurseProfileRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final NurseProfileRepository nurseProfileRepository;

   @Transactional
public Appointment createAppointment(Integer patientProfileId, Integer doctorProfileId, AppointmentCreateRequest request) {
    // ✅ Fetch the PatientProfile by its ID (patient_profiles.id)
    PatientProfile patient = patientProfileRepository.findById(patientProfileId)
        .orElseThrow(() -> new IllegalArgumentException("Patient not found with id: " + patientProfileId));

    // ✅ Fetch the DoctorProfile by its ID (doctor_profiles.id)
    DoctorProfile doctor = doctorProfileRepository.findById(doctorProfileId)
        .orElseThrow(() -> new IllegalArgumentException("Doctor not found with id: " + doctorProfileId));

    // ✅ Optional: Fetch Nurse if provided
    NurseProfile nurse = null;
    if (request.getNurseId() != null) {
        nurse = nurseProfileRepository.findById(request.getNurseId())
            .orElseThrow(() -> new IllegalArgumentException("Nurse not found with id: " + request.getNurseId()));
    }

    // ✅ Build and save the Appointment
    Appointment appointment = Appointment.builder()
        .patient(patient)                       // This will map to patient_id column
        .doctor(doctor)                         // This will map to doctor_id column
        .nurse(nurse)
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .reason(request.getReason())
        .appointmentType(request.getAppointmentType())
        .status(Appointment.AppointmentStatus.PENDING)
        .notes(request.getNotes())
        .bookingMethod(request.getBookingMethod())
        .bookedBy(request.getBookedBy())
        .build();

    return appointmentRepository.save(appointment);
}


   @Transactional
public Appointment updateAppointmentStatus(Integer id, AppointmentStatusUpdateRequest request) {
    Appointment appointment = appointmentRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Appointment not found with id: " + id));
    
    appointment.setStatus(Appointment.AppointmentStatus.valueOf(request.getStatus()));
    return appointmentRepository.save(appointment);
}


    public Appointment getAppointmentById(Integer id) {
        return appointmentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Appointment not found with id: " + id));
    }

    public List<Appointment> getAppointmentsByDoctor(Integer doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByPatient(Integer patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

  public List<Appointment> getAppointmentsByStatus(String status) {
        try {
            Appointment.AppointmentStatus enumStatus = Appointment.AppointmentStatus.valueOf(status.toUpperCase());
            return appointmentRepository.findByStatus(enumStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }


    public List<Appointment> getAppointmentsByDoctorAndStatus(Integer doctorId, String status) {
        return appointmentRepository.findByDoctorAndStatus(doctorId, status);
    }

    @Transactional
    public void deleteAppointment(Integer id) {
        appointmentRepository.deleteById(id);
    }
   public List<AppointmentDTO> getAllAppointments() {
    return appointmentRepository.findAll().stream()
        .map(AppointmentDTO::new)
        .toList();
}

@Transactional(readOnly = true)
public List<Appointment> getAppointmentsByPatientId(Integer patientId) {
    return appointmentRepository.findByPatientId(patientId);
}



}
