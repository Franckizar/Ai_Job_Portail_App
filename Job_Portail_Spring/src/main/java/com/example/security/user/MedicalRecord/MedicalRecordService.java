package com.example.security.user.MedicalRecord;

import com.example.security.user.Patient.PatientProfileRepository;
import com.example.security.user.Doctor.DoctorProfileRepository;
import com.example.security.user.Appointment.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional
    public MedicalRecord createMedicalRecord(Integer patientId, MedicalRecordRequest request) {
        var patient = patientProfileRepository.findById(patientId)
        //     .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        // var doctor = doctorProfileRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        // var appointment = request.getAppointmentId() != null
        //     ? appointmentRepository.findById(request.getAppointmentId()).orElse(null)
        //     : null;

        MedicalRecord record = MedicalRecord.builder()
            .patient(patient)
            // .doctor(doctor)
            // .appointment(appointment)
            .recordDate(request.getRecordDate())
            .type(request.getType())
            .details(request.getDetails())
            .followUpDate(request.getFollowUpDate())
            .chiefComplaint(request.getChiefComplaint())
            .medicalHistory(request.getMedicalHistory())
            .allergies(request.getAllergies())
            .examinationNotes(request.getExaminationNotes())
            .xrayFindings(request.getXrayFindings())
            .diagnosis(request.getDiagnosis())
            .treatmentPlan(request.getTreatmentPlan())
            .proceduresDone(request.getProceduresDone())
            .lastUpdated(request.getLastUpdated())
            .dentalHealthSummary(request.getDentalHealthSummary())
            .nextCheckupDate(request.getNextCheckupDate())
            .oralHygieneInstructions(request.getOralHygieneInstructions())
            .build();

        return medicalRecordRepository.save(record);
    }

    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Medical record not found"));
    }

    public List<MedicalRecord> getRecordsByPatient(Integer patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public List<MedicalRecord> getRecordsByDoctor(Integer doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    public List<MedicalRecord> getRecordsByAppointment(Integer appointmentId) {
        return medicalRecordRepository.findByAppointmentId(appointmentId);
    }

    @Transactional
    public MedicalRecord updateMedicalRecord(Long id, MedicalRecordRequest request) {
        MedicalRecord record = getMedicalRecordById(id);
        // Update fields as needed (for brevity, set all)
        record.setRecordDate(request.getRecordDate());
        record.setType(request.getType());
        record.setDetails(request.getDetails());
        record.setFollowUpDate(request.getFollowUpDate());
        record.setChiefComplaint(request.getChiefComplaint());
        record.setMedicalHistory(request.getMedicalHistory());
        record.setAllergies(request.getAllergies());
        record.setExaminationNotes(request.getExaminationNotes());
        record.setXrayFindings(request.getXrayFindings());
        record.setDiagnosis(request.getDiagnosis());
        record.setTreatmentPlan(request.getTreatmentPlan());
        record.setProceduresDone(request.getProceduresDone());
        record.setLastUpdated(request.getLastUpdated());
        record.setDentalHealthSummary(request.getDentalHealthSummary());
        record.setNextCheckupDate(request.getNextCheckupDate());
        record.setOralHygieneInstructions(request.getOralHygieneInstructions());
        return medicalRecordRepository.save(record);
    }

    @Transactional
    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }
@Transactional(readOnly = true)
public List<MedicalRecord> getAllMedicalRecords() {
    return medicalRecordRepository.findAll();
}


}
