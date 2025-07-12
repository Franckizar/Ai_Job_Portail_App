package com.example.security.user.Invoice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.security.user.Invoice.InvoiceItem.InvoiceResponse;

import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService invoiceService;

    // READ: Get all invoices
    @GetMapping("/all")
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        List<Invoice> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(invoices);
    }

    // CREATE: Create a new invoice for a patient (optionally linked to an appointment)
    @PostMapping("/create/patient/{patientId}")
    public ResponseEntity<Invoice> createInvoice(
            @PathVariable Integer patientId,
            @RequestParam(value = "appointmentId", required = false) Integer appointmentId,
            @RequestBody InvoiceRequest request) {
        Invoice invoice = invoiceService.createInvoice(patientId, appointmentId, request);
        return ResponseEntity.ok(invoice);
    }

    // READ: Get a single invoice by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Integer id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(invoice);
    }

    // READ: Get all invoices for a specific patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Invoice>> getInvoicesByPatient(@PathVariable Integer patientId) {
        List<Invoice> invoices = invoiceService.getInvoicesByPatient(patientId);
        return ResponseEntity.ok(invoices);
    }

    // READ: Get all invoices for a specific appointment
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Invoice>> getInvoicesByAppointment(@PathVariable Integer appointmentId) {
        List<Invoice> invoices = invoiceService.getInvoicesByAppointment(appointmentId);
        return ResponseEntity.ok(invoices);
    }

    // READ: Get all invoices with a specific status (e.g., 'paid', 'unpaid')
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Invoice>> getInvoicesByStatus(@PathVariable String status) {
        List<Invoice> invoices = invoiceService.getInvoicesByStatus(status);
        return ResponseEntity.ok(invoices);
    }

    // UPDATE: Update the status of an invoice (e.g., mark as paid)
    @PutMapping("/{id}/status")
    public ResponseEntity<Invoice> updateInvoiceStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        Invoice invoice = invoiceService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok(invoice);
    }

    // NEW: Process payment for an invoice using Campay
    @PostMapping("/{id}/pay")
    public ResponseEntity<PaymentResponse> processPayment(
            @PathVariable Integer id,
            @RequestBody PaymentRequest paymentRequest) {
        PaymentResponse response = invoiceService.processPayment(id, paymentRequest);
        return ResponseEntity.ok(response);
    }

    // NEW: Update payment details after successful payment
    @PutMapping("/{id}/payment-details")
    public ResponseEntity<Invoice> updatePaymentDetails(
            @PathVariable Integer id,
            @RequestBody PaymentUpdateRequest paymentUpdate) {
        Invoice invoice = invoiceService.updatePaymentDetails(id, paymentUpdate);
        return ResponseEntity.ok(invoice);
    }

    // NEW: Get payment status for an invoice
    @GetMapping("/{id}/payment-status")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable Integer id) {
        PaymentStatusResponse status = invoiceService.getPaymentStatus(id);
        return ResponseEntity.ok(status);
    }

    // DELETE: Delete an invoice by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Integer id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
    
}