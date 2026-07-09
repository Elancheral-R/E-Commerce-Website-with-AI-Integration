package com.nexmart.order.controller;

import com.nexmart.order.dto.OrderRequest;
import com.nexmart.order.entity.Order;
import com.nexmart.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody OrderRequest request
    ) {
        Order order = orderService.createOrder(UUID.fromString(userId), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(orderService.getOrdersForUser(UUID.fromString(userId)));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderDetails(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getOrderDetails(orderId));
    }
}
