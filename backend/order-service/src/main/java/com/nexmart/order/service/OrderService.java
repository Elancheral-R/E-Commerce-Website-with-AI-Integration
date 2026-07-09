package com.nexmart.order.service;

import com.nexmart.common.exception.ResourceNotFoundException;
import com.nexmart.order.client.InventoryClient;
import com.nexmart.order.dto.OrderRequest;
import com.nexmart.order.entity.Coupon;
import com.nexmart.order.entity.Order;
import com.nexmart.order.entity.OrderItem;
import com.nexmart.order.repository.CouponRepository;
import com.nexmart.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final InventoryClient inventoryClient;

    @Transactional
    public Order createOrder(UUID userId, OrderRequest request) {
        log.info("Processing checkout order for user: {}", userId);

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        Order order = Order.builder()
                .userId(userId)
                .shippingAddress(request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .status("PENDING")
                .build();

        for (OrderRequest.OrderItemDto itemDto : request.getItems()) {
            BigDecimal itemTotal = itemDto.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            items.add(OrderItem.builder()
                    .order(order)
                    .productId(itemDto.getProductId())
                    .quantity(itemDto.getQuantity())
                    .price(itemDto.getPrice())
                    .build());
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCodeAndActiveTrue(request.getCouponCode().toUpperCase()).orElse(null);
            if (coupon != null) {
                discount = coupon.getDiscountAmount();
                log.info("Applied coupon {}, discount: {}", request.getCouponCode(), discount);
            }
        }

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.18)); // 18% GST
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(999)) > 0 ? BigDecimal.ZERO : BigDecimal.valueOf(99);
        BigDecimal total = subtotal.add(tax).add(shipping).subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        order.setSubtotal(subtotal);
        order.setTax(tax);
        order.setShippingCost(shipping);
        order.setTotal(total);
        order.setItems(items);

        order = orderRepository.save(order);
        log.info("Saved initial order draft: {}", order.getId());

        // Step 2: Atomic inventory check & reserve via Eureka Feign Client
        boolean inventoryReserved = true;
        for (OrderItem item : items) {
            boolean success = inventoryClient.reserve(order.getId(), item.getProductId(), item.getQuantity());
            if (!success) {
                inventoryReserved = false;
                break;
            }
        }

        if (!inventoryReserved) {
            order.setStatus("FAILED");
            orderRepository.save(order);
            // Release any partial reserves
            inventoryClient.release(order.getId());
            throw new IllegalStateException("Insufficient inventory stock for products in your checkout cart.");
        }

        // Step 3: Payment simulation
        if ("cod".equalsIgnoreCase(order.getPaymentMethod())) {
            order.setStatus("PLACED");
            inventoryClient.confirm(order.getId());
        } else {
            // Mocking payment gateway validation (always succeeds for mock)
            order.setStatus("PAID");
            order.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            inventoryClient.confirm(order.getId());
            log.info("Payment confirmed via mock portal, txn: {}", order.getTransactionId());
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersForUser(UUID userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderDetails(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }
}
