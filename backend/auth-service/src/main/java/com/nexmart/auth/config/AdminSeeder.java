package com.nexmart.auth.config;

import com.nexmart.auth.entity.Role;
import com.nexmart.auth.entity.User;
import com.nexmart.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@nexmart.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .name("System Admin")
                    .phone("0000000000")
                    .role(Role.ADMIN)
                    .isVerified(true)
                    .membershipLevel("platinum")
                    .build();
            userRepository.save(admin);
            log.info("Successfully seeded admin user in database: {}", adminEmail);
        } else {
            log.info("Admin user already exists in database: {}", adminEmail);
        }
    }
}
