package com.nexmart.ai.controller;

import com.nexmart.ai.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @GetMapping("/assistant")
    public ResponseEntity<List<Map<String, Object>>> chatAssistant(@RequestParam String query) {
        return ResponseEntity.ok(aiService.searchRecommendations(query));
    }

    @GetMapping("/pricing/dynamic")
    public ResponseEntity<BigDecimal> getDynamicPrice(
            @RequestParam UUID productId,
            @RequestParam BigDecimal basePrice,
            @RequestParam Integer currentStock
    ) {
        return ResponseEntity.ok(aiService.computeDynamicPrice(productId, basePrice, currentStock));
    }

    @PostMapping("/fraud/assess")
    public ResponseEntity<Map<String, Object>> checkFraud(
            @RequestParam UUID userId,
            @RequestParam String paymentMethod,
            @RequestParam BigDecimal amount
    ) {
        return ResponseEntity.ok(aiService.assessFraudRisk(userId, paymentMethod, amount));
    }
}
