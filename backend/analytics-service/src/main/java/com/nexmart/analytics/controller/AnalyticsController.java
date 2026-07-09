package com.nexmart.analytics.controller;

import com.nexmart.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        return ResponseEntity.ok(analyticsService.getAdminDashboardStats());
    }
}
