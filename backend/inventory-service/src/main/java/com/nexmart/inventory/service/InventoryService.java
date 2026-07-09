package com.nexmart.inventory.service;

import com.nexmart.inventory.entity.Inventory;
import com.nexmart.inventory.entity.InventoryReservation;
import com.nexmart.inventory.repository.InventoryRepository;
import com.nexmart.inventory.repository.InventoryReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryReservationRepository reservationRepository;

    public Integer getStockForProduct(UUID productId) {
        return inventoryRepository.findByProductId(productId)
                .map(Inventory::getAvailableQty)
                .orElse(0);
    }

    @Transactional
    public boolean reserve(UUID orderId, UUID productId, Integer qty) {
        Inventory inv = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> inventoryRepository.save(
                        Inventory.builder().productId(productId).availableQty(100).reservedQty(0).build() // auto-restock mock
                ));

        if (inv.getAvailableQty() < qty) {
            log.warn("Cannot reserve inventory: Requested {} for product {}, only {} available.", qty, productId, inv.getAvailableQty());
            return false;
        }

        // Reserve quantities
        inv.setAvailableQty(inv.getAvailableQty() - qty);
        inv.setReservedQty(inv.getReservedQty() + qty);
        inventoryRepository.save(inv);

        InventoryReservation res = InventoryReservation.builder()
                .orderId(orderId)
                .productId(productId)
                .reservedQty(qty)
                .status("RESERVED")
                .build();
        reservationRepository.save(res);

        log.info("Reserved {} units for order {} on product {}", qty, orderId, productId);
        return true;
    }

    @Transactional
    public void confirm(UUID orderId) {
        List<InventoryReservation> reservations = reservationRepository.findByOrderId(orderId);
        for (InventoryReservation res : reservations) {
            if ("RESERVED".equals(res.getStatus())) {
                res.setStatus("CONFIRMED");
                reservationRepository.save(res);

                Inventory inv = inventoryRepository.findByProductId(res.getProductId()).orElse(null);
                if (inv != null) {
                    inv.setReservedQty(Math.max(0, inv.getReservedQty() - res.getReservedQty()));
                    inventoryRepository.save(inv);
                }
            }
        }
        log.info("Confirmed inventory reservation for order {}", orderId);
    }

    @Transactional
    public void release(UUID orderId) {
        List<InventoryReservation> reservations = reservationRepository.findByOrderId(orderId);
        for (InventoryReservation res : reservations) {
            if ("RESERVED".equals(res.getStatus())) {
                res.setStatus("REJECTED");
                reservationRepository.save(res);

                Inventory inv = inventoryRepository.findByProductId(res.getProductId()).orElse(null);
                if (inv != null) {
                    inv.setAvailableQty(inv.getAvailableQty() + res.getReservedQty());
                    inv.setReservedQty(Math.max(0, inv.getReservedQty() - res.getReservedQty()));
                    inventoryRepository.save(inv);
                }
            }
        }
        log.info("Released/Cancelled inventory reservation for order {}", orderId);
    }
}
