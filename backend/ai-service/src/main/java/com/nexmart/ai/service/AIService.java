package com.nexmart.ai.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class AIService {

    public List<Map<String, Object>> searchRecommendations(String query) {
        log.info("Processing AI semantic search for: {}", query);
        List<Map<String, Object>> recommendations = new ArrayList<>();
        String lower = query.toLowerCase();

        if (lower.contains("laptop")) {
            recommendations.add(Map.of(
                    "productId", UUID.randomUUID().toString(),
                    "name", "Blade Pro 16 Intel i9 Gaming Laptop",
                    "price", new BigDecimal(88999),
                    "confidence", 0.98
            ));
            recommendations.add(Map.of(
                    "productId", UUID.randomUUID().toString(),
                    "name", "TUF A15 AMD Ryzen 7 Gaming Laptop",
                    "price", new BigDecimal(78999),
                    "confidence", 0.91
            ));
        } else if (lower.contains("shoe") || lower.contains("run")) {
            recommendations.add(Map.of(
                    "productId", UUID.randomUUID().toString(),
                    "name", "Zoom Vaporfly 3 Carbon Road Racer",
                    "price", new BigDecimal(19999),
                    "confidence", 0.95
            ));
        } else {
            // General recommendation fallback
            recommendations.add(Map.of(
                    "productId", UUID.randomUUID().toString(),
                    "name", "Noise-Cancelling Premium Studio Headphones",
                    "price", new BigDecimal(24999),
                    "confidence", 0.82
            ));
        }
        return recommendations;
    }

    public BigDecimal computeDynamicPrice(UUID productId, BigDecimal basePrice, Integer currentStock) {
        log.info("Computing dynamic price model for: {}, base: {}, stock: {}", productId, basePrice, currentStock);
        BigDecimal multiplier = BigDecimal.ONE;

        if (currentStock < 10) {
            multiplier = multiplier.add(BigDecimal.valueOf(0.08)); // increase price by 8% if low stock
        } else if (currentStock > 100) {
            multiplier = multiplier.subtract(BigDecimal.valueOf(0.05)); // decrease price by 5% if excess stock
        }

        return basePrice.multiply(multiplier);
    }

    public Map<String, Object> assessFraudRisk(UUID userId, String paymentMethod, BigDecimal amount) {
        log.info("Running real-time fraud assessment for user: {}, method: {}", userId, paymentMethod);
        boolean isSuspicious = amount.compareTo(BigDecimal.valueOf(250000)) > 0;
        double riskScore = isSuspicious ? 0.88 : 0.05;

        return Map.of(
                "userId", userId.toString(),
                "fraudRiskScore", riskScore,
                "status", isSuspicious ? "FLAGGED" : "APPROVED",
                "recommendedAction", isSuspicious ? "TWO_FACTOR_AUTHENTICATION_REQUIRED" : "ALLOW_TRANSACTION"
        );
    }
}
