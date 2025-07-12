package com.example.security.user.Invoice;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.example.security.user.Invoice.InvoiceItem.InvoiceItemRequest;

@Data
public class InvoiceRequest {
    private LocalDate dateIssued;
    private BigDecimal totalAmount;
    private String status;
    private LocalDate dueDate;


    ///////////////////////////////////////////
     private Integer patientId;
    private Integer appointmentId;
    // private LocalDate dateIssued;
    // private BigDecimal totalAmount;
    // private String status;
    // private LocalDate dueDate;

    private String paymentMethod;
    private String transactionId;
    private LocalDate paymentDate;

    private List<InvoiceItemRequest> items;
}
