package com.example.security.user.Invoice.InvoiceItem;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class InvoiceItemRequest {
    private Integer serviceId;
    private Integer quantity;
    private BigDecimal unitPrice;
}
