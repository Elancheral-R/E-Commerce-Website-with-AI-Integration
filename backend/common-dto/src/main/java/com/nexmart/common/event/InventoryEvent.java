package com.nexmart.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryEvent implements Serializable {
    private UUID productId;
    private Integer updatedStock;
    private String triggerReason; // ORDER_RESERVED, INVENTORY_RESTOCKED, RESERVE_FAILED
    private UUID relatedOrderId;
}
