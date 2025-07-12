package com.example.security.user.Appointment;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentCreateRequest {
    private Integer nurseId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String reason;
    private String appointmentType;
    private String notes;
    private String bookingMethod;
    private String bookedBy;
}
