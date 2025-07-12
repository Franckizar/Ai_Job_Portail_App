package com.example.security.user.Invoice;

import com.example.security.user.Patient.PatientProfile;
import com.example.security.user.Patient.PatientProfileRepository;
import com.example.security.user.Appointment.Appointment;
import com.example.security.user.Appointment.AppointmentRepository;
import com.example.security.user.Invoice.InvoiceItem.InvoiceItem;
import com.example.security.user.Invoice.InvoiceItem.InvoiceItemRepository;
import com.example.security.user.Invoice.InvoiceItem.InvoiceResponse;
import com.example.security.user.Service.ServiceRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final ServiceRepository serviceRepository;
    private final InvoiceItemRepository invoiceItemRepository;
    private final RestTemplate restTemplate;

    @Value("${campay.api.url:https://demo.campay.net/api/collect/}")
    private String campayApiUrl;

    @Value("${campay.api.token:9f80ec928d13add9b75537127b5cc95e11e83058}")
    // @Value("${campay.api.token:69e2df238ea8d66f24018574c5de51e2b77d9abb}")
    // @Value("${campay.api.token:14425441cf51609044bfcf75621108ce9f7c88dd}")
    private String campayApiToken;

    /**
     * ✅ Get all invoices
     */
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    /**
     * ✅ Create a new Invoice with items
     */
    @Transactional
    public Invoice createInvoice(Integer patientId, Integer appointmentId, InvoiceRequest request) {
        // ✅ Fetch Patient
        PatientProfile patient = patientProfileRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + patientId));

        // ✅ Fetch Appointment (optional)
        Appointment appointment = null;
        if (appointmentId != null) {
            appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Appointment not found with ID: " + appointmentId));
        }

        // ✅ Create and Save Invoice (without items first)
        Invoice invoice = Invoice.builder()
                .patient(patient)
                .appointment(appointment)
                .dateIssued(request.getDateIssued())
                .totalAmount(request.getTotalAmount())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .paymentMethod(request.getPaymentMethod())
                .transactionId(request.getTransactionId())
                .paymentDate(request.getPaymentDate())
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // ✅ Create and Save Invoice Items
        List<InvoiceItem> items = request.getItems().stream().map(itemReq -> {
            var service = serviceRepository.findById(itemReq.getServiceId())
                    .orElseThrow(() -> new IllegalArgumentException("Service not found with ID: " + itemReq.getServiceId()));

            return InvoiceItem.builder()
                    .invoice(savedInvoice)
                    .service(service)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(itemReq.getUnitPrice())
                    .totalPrice(itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())))
                    .build();
        }).collect(Collectors.toList());

        invoiceItemRepository.saveAll(items);
        savedInvoice.setItems(items);

        return savedInvoice;
    }

    /**
     * ✅ Get Invoice by ID
     */
    public Invoice getInvoiceById(Integer id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with ID: " + id));
    }

    /**
     * ✅ Get Invoices by Patient ID
     */
    public List<Invoice> getInvoicesByPatient(Integer patientId) {
        return invoiceRepository.findByPatientId(patientId);
    }

    /**
     * ✅ Get Invoices by Appointment ID
     */
    public List<Invoice> getInvoicesByAppointment(Integer appointmentId) {
        return invoiceRepository.findByAppointmentId(appointmentId);
    }

    /**
     * ✅ Get Invoices by Status
     */
    public List<Invoice> getInvoicesByStatus(String status) {
        return invoiceRepository.findByStatus(status);
    }

    /**
     * ✅ Update Invoice Status
     */
    @Transactional
    public Invoice updateInvoiceStatus(Integer id, String status) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(status);
        return invoiceRepository.save(invoice);
    }

    @Transactional
public PaymentResponse processPayment(Integer invoiceId, PaymentRequest paymentRequest) {
    Invoice invoice = getInvoiceById(invoiceId);

    if ("paid".equalsIgnoreCase(invoice.getStatus())) {
        throw new IllegalStateException("Invoice is already paid.");
    }

    try {
        // Prepare Campay request payload
        Map<String, Object> campayRequest = new HashMap<>();
        campayRequest.put("amount", invoice.getTotalAmount().toString());
        campayRequest.put("from", "+237" + paymentRequest.getPhoneNumber());
        campayRequest.put("description", "Payment for Invoice #" + invoiceId);
        campayRequest.put("external_reference", "INV-" + invoiceId);
        campayRequest.put("currency", "XAF");

        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Token " + campayApiToken);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(campayRequest, headers);

        // Call Campay API
        ResponseEntity<Map> campayResponse = restTemplate.exchange(
                campayApiUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        Map<String, Object> responseBody = campayResponse.getBody();

        // Check API success
        if (campayResponse.getStatusCode() == HttpStatus.OK && responseBody != null && responseBody.get("id") != null) {
            String transactionId = responseBody.get("id").toString();

            // Update invoice
            invoice.setStatus("paid");
            invoice.setTransactionId(transactionId);
            invoice.setPaymentDate(LocalDate.now());
            invoice.setPaymentMethod("Campay");
            invoiceRepository.save(invoice);

            return PaymentResponse.builder()
                    .success(true)
                    .transactionId(transactionId)
                    .amount(invoice.getTotalAmount().doubleValue()) 
                    .invoiceStatus("paid")
                    .message("Payment successful. Transaction ID: " + transactionId)
                    .build();

        } else {
            String errorMsg = (responseBody != null && responseBody.get("message") != null)
                    ? responseBody.get("message").toString()
                    : "Payment failed. No transaction ID returned.";

            invoice.setStatus("payment_failed");
            invoiceRepository.save(invoice);

            return PaymentResponse.builder()
                    .success(false)
                    .transactionId(null)
                    .amount(invoice.getTotalAmount().doubleValue()) 
                    .invoiceStatus("payment_failed")
                    .message("Payment failed: " + errorMsg)
                    .build();
        }

    } catch (Exception e) {
        // Handle unexpected error
        invoice.setStatus("payment_error");
        invoiceRepository.save(invoice);

        return PaymentResponse.builder()
                .success(false)
                .transactionId(null)
                 .amount(invoice.getTotalAmount().doubleValue()) 
                .invoiceStatus("payment_error")
                .message("Payment processing error: " + e.getMessage())
                .build();
    }
}


    /**
     * ✅ Update Payment Details
     */
    @Transactional
    public Invoice updatePaymentDetails(Integer invoiceId, PaymentUpdateRequest paymentUpdate) {
        Invoice invoice = getInvoiceById(invoiceId);
        
        if (paymentUpdate.getTransactionId() != null) {
            invoice.setTransactionId(paymentUpdate.getTransactionId());
        }
        if (paymentUpdate.getPaymentDate() != null) {
            invoice.setPaymentDate(paymentUpdate.getPaymentDate());
        }
        if (paymentUpdate.getPaymentMethod() != null) {
            invoice.setPaymentMethod(paymentUpdate.getPaymentMethod());
        }
        if (paymentUpdate.getStatus() != null) {
            invoice.setStatus(paymentUpdate.getStatus());
        }

        return invoiceRepository.save(invoice);
    }

    /**
     * ✅ Get Payment Status
     */
    public PaymentStatusResponse getPaymentStatus(Integer invoiceId) {
        Invoice invoice = getInvoiceById(invoiceId);
        
        return PaymentStatusResponse.builder()
                .invoiceId(invoiceId)
                .status(invoice.getStatus())
                .totalAmount(invoice.getTotalAmount())
                .paymentMethod(invoice.getPaymentMethod())
                .transactionId(invoice.getTransactionId())
                .paymentDate(invoice.getPaymentDate())
                .dateIssued(invoice.getDateIssued())
                .dueDate(invoice.getDueDate())
                .build();
    }

    /**
     * ✅ Delete Invoice
     */
    @Transactional
    public void deleteInvoice(Integer id) {
        if (!invoiceRepository.existsById(id)) {
            throw new IllegalArgumentException("Invoice not found with ID: " + id);
        }
        invoiceRepository.deleteById(id);
    }













    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     @Transactional 
// public PaymentResponse processPayment(Integer invoiceId, PaymentRequest paymentRequest) {
//     Invoice invoice = getInvoiceById(invoiceId);
    
//     if ("paid".equalsIgnoreCase(invoice.getStatus())) {
//         throw new IllegalStateException("Invoice is already paid.");
//     }
    
//     try {
//         // Prepare Campay request payload
//         Map<String, Object> campayRequest = new HashMap<>();
//         campayRequest.put("amount", invoice.getTotalAmount().toString());
//         campayRequest.put("from", "+237" + paymentRequest.getPhoneNumber());
//         campayRequest.put("description", "Payment for Invoice #" + invoiceId);
//         campayRequest.put("external_reference", "INV-" + invoiceId);
//         campayRequest.put("currency", "XAF");
        
//         // Log the request being sent
//         System.out.println("=== CAMPAY API REQUEST DEBUG ===");
//         System.out.println("URL: " + campayApiUrl);
//         System.out.println("Request Payload: " + campayRequest);
//         System.out.println("================================");
        
//         // Prepare headers
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         headers.set("Authorization", "Token " + campayApiToken);
        
//         HttpEntity<Map<String, Object>> entity = new HttpEntity<>(campayRequest, headers);
        
//         // Call Campay API
//         ResponseEntity<Map> campayResponse = restTemplate.exchange(
//                 campayApiUrl,
//                 HttpMethod.POST,
//                 entity,
//                 Map.class
//         );
        
//         Map<String, Object> responseBody = campayResponse.getBody();
        
//         // DETAILED LOGGING TO DEBUG THE RESPONSE
//         System.out.println("=== CAMPAY API RESPONSE DEBUG ===");
//         System.out.println("Status Code: " + campayResponse.getStatusCode());
//         System.out.println("Status Code Value: " + campayResponse.getStatusCode().value());
//         System.out.println("Response Body: " + responseBody);
//         System.out.println("Response Body Type: " + (responseBody != null ? responseBody.getClass().getName() : "null"));
//         System.out.println("Response Keys: " + (responseBody != null ? responseBody.keySet() : "null"));
        
//         if (responseBody != null) {
//             System.out.println("Individual Response Fields:");
//             for (Map.Entry<String, Object> entry : responseBody.entrySet()) {
//                 System.out.println("  " + entry.getKey() + " = " + entry.getValue() + 
//                                  " (Type: " + (entry.getValue() != null ? entry.getValue().getClass().getSimpleName() : "null") + ")");
//             }
//         }
//         System.out.println("=================================");
        
//         // Check API success - Updated logic based on common response patterns
//         boolean isSuccess = false;
//         String transactionId = null;
//         String statusMessage = "";
        
//         if (campayResponse.getStatusCode() == HttpStatus.OK && responseBody != null) {
//             // Try different possible field names for transaction ID
//             if (responseBody.get("id") != null) {
//                 transactionId = responseBody.get("id").toString();
//                 isSuccess = true;
//                 System.out.println("Found transaction ID in 'id' field: " + transactionId);
//             } else if (responseBody.get("transaction_id") != null) {
//                 transactionId = responseBody.get("transaction_id").toString();
//                 isSuccess = true;
//                 System.out.println("Found transaction ID in 'transaction_id' field: " + transactionId);
//             } else if (responseBody.get("reference") != null) {
//                 transactionId = responseBody.get("reference").toString();
//                 isSuccess = true;
//                 System.out.println("Found transaction ID in 'reference' field: " + transactionId);
//             } else if (responseBody.get("txn_id") != null) {
//                 transactionId = responseBody.get("txn_id").toString();
//                 isSuccess = true;
//                 System.out.println("Found transaction ID in 'txn_id' field: " + transactionId);
//             } else if (responseBody.get("external_reference") != null) {
//                 transactionId = responseBody.get("external_reference").toString();
//                 isSuccess = true;
//                 System.out.println("Found transaction ID in 'external_reference' field: " + transactionId);
//             }
            
//             // Check if there's a nested data object
//             if (!isSuccess && responseBody.get("data") != null) {
//                 Object dataObj = responseBody.get("data");
//                 if (dataObj instanceof Map) {
//                     Map<String, Object> dataMap = (Map<String, Object>) dataObj;
//                     if (dataMap.get("id") != null) {
//                         transactionId = dataMap.get("id").toString();
//                         isSuccess = true;
//                         System.out.println("Found transaction ID in 'data.id' field: " + transactionId);
//                     } else if (dataMap.get("transaction_id") != null) {
//                         transactionId = dataMap.get("transaction_id").toString();
//                         isSuccess = true;
//                         System.out.println("Found transaction ID in 'data.transaction_id' field: " + transactionId);
//                     }
//                 }
//             }
            
//             // Check for success indicators
//             Object statusObj = responseBody.get("status");
//             Object successObj = responseBody.get("success");
            
//             if (statusObj != null) {
//                 statusMessage = statusObj.toString();
//                 System.out.println("Response status: " + statusMessage);
//             }
            
//             if (successObj != null) {
//                 System.out.println("Response success flag: " + successObj);
//                 if (successObj instanceof Boolean) {
//                     isSuccess = isSuccess && (Boolean) successObj;
//                 } else if (successObj instanceof String) {
//                     isSuccess = isSuccess && "true".equalsIgnoreCase(successObj.toString());
//                 }
//             }
//         }
        
//         if (isSuccess && transactionId != null && !transactionId.trim().isEmpty()) {
//             // Success - Update invoice
//             invoice.setStatus("paid");
//             invoice.setTransactionId(transactionId);
//             invoice.setPaymentDate(LocalDate.now());
//             invoice.setPaymentMethod("Campay");
//             invoiceRepository.save(invoice);
            
//             System.out.println("Payment successful! Transaction ID: " + transactionId);
            
//             return PaymentResponse.builder()
//                     .success(true)
//                     .transactionId(transactionId)
//                     .amount(invoice.getTotalAmount().doubleValue())
//                     .invoiceStatus("paid")
//                     .message("Payment successful. Transaction ID: " + transactionId)
//                     .build();
                    
//         } else {
//             // Failure - Extract error message
//             String errorMsg = "Payment failed. No transaction ID returned.";
            
//             if (responseBody != null) {
//                 if (responseBody.get("message") != null) {
//                     errorMsg = responseBody.get("message").toString();
//                 } else if (responseBody.get("error") != null) {
//                     errorMsg = responseBody.get("error").toString();
//                 } else if (responseBody.get("error_message") != null) {
//                     errorMsg = responseBody.get("error_message").toString();
//                 } else if (responseBody.get("description") != null) {
//                     errorMsg = responseBody.get("description").toString();
//                 }
//             }
            
//             System.out.println("Payment failed with error: " + errorMsg);
            
//             invoice.setStatus("payment_failed");
//             invoiceRepository.save(invoice);
            
//             return PaymentResponse.builder()
//                     .success(false)
//                     .transactionId(null)
//                     .amount(invoice.getTotalAmount().doubleValue())
//                     .invoiceStatus("payment_failed")
//                     .message("Payment failed: " + errorMsg)
//                     .build();
//         }
        
//     } catch (HttpClientErrorException e) {
//         // Handle HTTP client errors (4xx)
//         System.out.println("=== HTTP CLIENT ERROR ===");
//         System.out.println("Status Code: " + e.getStatusCode());
//         System.out.println("Response Body: " + e.getResponseBodyAsString());
//         System.out.println("========================");
        
//         invoice.setStatus("payment_error");
//         invoiceRepository.save(invoice);
        
//         return PaymentResponse.builder()
//                 .success(false)
//                 .transactionId(null)
//                 .amount(invoice.getTotalAmount().doubleValue())
//                 .invoiceStatus("payment_error")
//                 .message("Payment processing error: " + e.getMessage())
//                 .build();
                
//     } catch (HttpServerErrorException e) {
//         // Handle HTTP server errors (5xx)
//         System.out.println("=== HTTP SERVER ERROR ===");
//         System.out.println("Status Code: " + e.getStatusCode());
//         System.out.println("Response Body: " + e.getResponseBodyAsString());
//         System.out.println("=========================");
        
//         invoice.setStatus("payment_error");
//         invoiceRepository.save(invoice);
        
//         return PaymentResponse.builder()
//                 .success(false)
//                 .transactionId(null)
//                 .amount(invoice.getTotalAmount().doubleValue())
//                 .invoiceStatus("payment_error")
//                 .message("Payment server error: " + e.getMessage())
//                 .build();
                
//     } catch (Exception e) {
//         // Handle unexpected errors
//         System.out.println("=== UNEXPECTED ERROR ===");
//         System.out.println("Error Type: " + e.getClass().getName());
//         System.out.println("Error Message: " + e.getMessage());
//         e.printStackTrace();
//         System.out.println("========================");
        
//         invoice.setStatus("payment_error");
//         invoiceRepository.save(invoice);
        
//         return PaymentResponse.builder()
//                 .success(false)
//                 .transactionId(null)
//                 .amount(invoice.getTotalAmount().doubleValue())
//                 .invoiceStatus("payment_error")
//                 .message("Payment processing error: " + e.getMessage())
//                 .build();
//     }
// }
    
}