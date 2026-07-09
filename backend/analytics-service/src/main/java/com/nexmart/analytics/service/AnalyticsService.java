package com.nexmart.analytics.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AnalyticsService {

    public Map<String, Object> getAdminDashboardStats() {
        log.info("Aggregating system-wide business dashboard metrics");
        Map<String, Object> stats = new HashMap<>();

        stats.put("dailyRevenue", new BigDecimal(1250000));
        stats.put("monthlyRevenue", new BigDecimal(38500000));
        stats.put("liveVisitors", 4820);
        stats.put("ordersPerMinute", 45);
        stats.put("failedPaymentsCount", 12);
        stats.put("inventoryHealth", "EXCELLENT");
        stats.put("revenueForecast", new BigDecimal(42000000));
        
        stats.put("topCategories", List.of(
                Map.of("category", "Electronics", "sales", new BigDecimal(18000000)),
                Map.of("category", "Fashion", "sales", new BigDecimal(9500000)),
                Map.of("category", "Home Appliances", "sales", new BigDecimal(6200000))
        ));

        stats.put("topProducts", List.of(
                Map.of("name", "Blade Pro 16 Intel i9 Gaming Laptop", "orders", 124),
                Map.of("name", "Noise-Cancelling Premium Studio Headphones", "orders", 98),
                Map.of("name", "Zoom Vaporfly 3 Carbon Road Racer", "orders", 64)
        ));

        return stats;
    }
}
