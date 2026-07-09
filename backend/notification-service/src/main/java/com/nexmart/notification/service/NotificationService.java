package com.nexmart.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class NotificationService {

    public void sendEmailNotification(UUID userId, String subject, String body) {
        log.info("Sending Email to User ID: {} | Subject: '{}' | Content: '{}'", userId, subject, body);
    }

    public void sendSMSNotification(UUID userId, String text) {
        log.info("Sending SMS to User ID: {} | Text: '{}'", userId, text);
    }

    public void sendPushNotification(UUID userId, String title, String body) {
        log.info("Sending Push Notification to User ID: {} | Title: '{}' | Body: '{}'", userId, title, body);
    }
}
