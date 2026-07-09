package com.nexmart.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent implements Serializable {
    private UUID orderId;
    private UUID userId;
    private String status; // CREATED, PAID, SHIPPED, CANCELLED
    private BigDecimal amount;
    private String shippingAddress;
    private List<OrderItemEvent> items;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemEvent implements Serializable {
        private UUID productId;
        private Integer quantity;
        private BigDecimal price;
    }
}
