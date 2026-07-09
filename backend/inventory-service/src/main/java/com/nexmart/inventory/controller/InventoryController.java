package com.nexmart.inventory.controller;

import com.nexmart.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<Integer> getStock(@PathVariable UUID productId) {
        return ResponseEntity.ok(inventoryService.getStockForProduct(productId));
    }

    @PostMapping("/reserve")
    public ResponseEntity<Boolean> reserve(
            @RequestParam UUID orderId,
            @RequestParam UUID productId,
            @RequestParam Integer quantity
    ) {
        boolean success = inventoryService.reserve(orderId, productId, quantity);
        return ResponseEntity.ok(success);
    }

    @PostMapping("/confirm/{orderId}")
    public ResponseEntity<Void> confirm(@PathVariable UUID orderId) {
        inventoryService.confirm(orderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/release/{orderId}")
    public ResponseEntity<Void> release(@PathVariable UUID orderId) {
        inventoryService.release(orderId);
        return ResponseEntity.ok().build();
    }
}
