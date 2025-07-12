package com.example.security.user.Appointment;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;

    // CREATE: Book a new appointment for a patient with a doctor (status is PENDING by default)
    @PostMapping("/create/patient/{patientId}/doctor/{doctorId}")
    public ResponseEntity<Appointment> createAppointment(
            @PathVariable Integer patientId,
            @PathVariable Integer doctorId,
            @RequestBody AppointmentCreateRequest request) {
        Appointment appointment = appointmentService.createAppointment(patientId, doctorId, request);
        return ResponseEntity.ok(appointment);
    }

    // UPDATE: Change the status of an appointment (e.g., doctor confirms or cancels)
   @PutMapping("/{id}/status")
public ResponseEntity<Appointment> updateAppointmentStatus(
        @PathVariable Integer id,
        @RequestBody AppointmentStatusUpdateRequest request) {
    Appointment appointment = appointmentService.updateAppointmentStatus(id, request);
    return ResponseEntity.ok(appointment);
}


    // READ: Get a single appointment by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Integer id) {
        Appointment appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    // READ: Get all appointments for a specific doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(
            @PathVariable Integer doctorId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctor(doctorId);
        return ResponseEntity.ok(appointments);
    }

    // READ: Get all appointments for a specific patient
    // @GetMapping("/patient/{patientId}")
    // public ResponseEntity<List<Appointment>> getAppointmentsByPatient(
    //         @PathVariable Integer patientId) {
    //     List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patientId);
    //     return ResponseEntity.ok(appointments);
    // }

    // READ: Get all appointments with a specific status (e.g., all PENDING appointments)
 // ✅ GET by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }



    // READ: Get all appointments for a doctor with a specific status (e.g., all CONFIRMED for Dr. X)
    @GetMapping("/doctor/{doctorId}/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorAndStatus(
            @PathVariable Integer doctorId,
            @PathVariable String status) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorAndStatus(doctorId, status);
        return ResponseEntity.ok(appointments);
    }

    // DELETE: Remove an appointment by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
     @GetMapping("/all")
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }
    // @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/patient/{id}")
public ResponseEntity<List<Appointment>> getAppointmentsByPatientId(@PathVariable Integer id) {
    List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(id);
    return ResponseEntity.ok(appointments);
}


}
