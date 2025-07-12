package com.example.security.user.Appointment;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Integer id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String status;
    private String reason;

    public AppointmentDTO(Appointment appointment) {
        this.id = appointment.getId();
        // You can customize the title as needed:
        this.title = appointment.getReason() != null ? appointment.getReason() : "Appointment";
        this.start = appointment.getStartTime();
        this.end = appointment.getEndTime();
        this.status = appointment.getStatus() != null ? appointment.getStatus().name() : null;
        this.reason = appointment.getReason();
    }
}
