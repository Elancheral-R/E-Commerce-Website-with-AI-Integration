package com.nexmart.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "inventory-service")
public interface InventoryClient {

    @PostMapping("/api/v1/inventory/reserve")
    boolean reserve(
            @RequestParam("orderId") UUID orderId,
            @RequestParam("productId") UUID productId,
            @RequestParam("quantity") Integer quantity
    );

    @PostMapping("/api/v1/inventory/confirm/{orderId}")
    void confirm(@PathVariable("orderId") UUID orderId);

    @PostMapping("/api/v1/inventory/release/{orderId}")
    void release(@PathVariable("orderId") UUID orderId);
}
