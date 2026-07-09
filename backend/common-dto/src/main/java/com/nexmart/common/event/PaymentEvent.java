package com.nexmart.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent implements Serializable {
    private UUID paymentId;
    private UUID orderId;
    private UUID userId;
    private BigDecimal amount;
    private String method; // upi, card, cod
    private String status; // SUCCESS, FAILED
    private String transactionId;
}
