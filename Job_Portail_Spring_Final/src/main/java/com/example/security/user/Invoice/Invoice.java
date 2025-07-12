package com.example.security.user.Invoice;

import com.example.security.user.Patient.PatientProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.example.security.user.Appointment.Appointment;
import com.example.security.user.Invoice.InvoiceItem.InvoiceItem;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Many invoices can be for one patient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", referencedColumnName = "id")
    @JsonIgnore
    private PatientProfile patient;

    // Many invoices can be linked to one appointment (or null)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", referencedColumnName = "id")
    @JsonIgnore
    private Appointment appointment;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonManagedReference
    private List<InvoiceItem> items;


    private LocalDate dateIssued;
    private BigDecimal totalAmount;
    private String status; // e.g., 'paid', 'unpaid', 'partially paid'
    private LocalDate dueDate;

    private String paymentMethod; // "Campay", "Cash", etc.
    private String transactionId; // Campay transaction reference
    private LocalDate paymentDate; 


    // If you want to add invoice items, create a separate entity and relate here
    // @OneToMany(mappedBy = "invoice")
    // private List<InvoiceItem> items;
}
