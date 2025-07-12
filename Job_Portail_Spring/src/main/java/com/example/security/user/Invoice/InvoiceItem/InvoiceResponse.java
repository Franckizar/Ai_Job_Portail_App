package com.example.security.user.Invoice.InvoiceItem;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
// import java.util.List;

@Data
@Builder
public class InvoiceResponse {
    private Integer id;
    private LocalDateTime dateIssued;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime dueDate;
    private String paymentMethod;
    private String transactionId;
    private LocalDateTime paymentDate;

    // ✅ Nested Invoice Items (DTO version)
    // private List<InvoiceItemResponse> items;

    // ✅ Optional: If you want to also include Patient Name or Appointment Info, you can add fields like:
    // private String patientFullName;
    // private Integer appointmentId;
}
