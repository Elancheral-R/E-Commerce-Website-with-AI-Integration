package com.nexmart.notification.controller;

import com.nexmart.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/send/email")
    public ResponseEntity<Void> sendEmail(
            @RequestParam UUID userId,
            @RequestParam String subject,
            @RequestParam String body
    ) {
        notificationService.sendEmailNotification(userId, subject, body);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send/sms")
    public ResponseEntity<Void> sendSMS(
            @RequestParam UUID userId,
            @RequestParam String message
    ) {
        notificationService.sendSMSNotification(userId, message);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send/push")
    public ResponseEntity<Void> sendPush(
            @RequestParam UUID userId,
            @RequestParam String title,
            @RequestParam String body
    ) {
        notificationService.sendPushNotification(userId, title, body);
        return ResponseEntity.ok().build();
    }
}
