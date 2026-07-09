package com.nexmart.auth.service;

import com.nexmart.auth.dto.RegisterRequest;
import com.nexmart.auth.entity.RefreshToken;
import com.nexmart.auth.entity.Role;
import com.nexmart.auth.entity.User;
import com.nexmart.auth.repository.RefreshTokenRepository;
import com.nexmart.auth.repository.UserRepository;
import com.nexmart.common.dto.AuthRequest;
import com.nexmart.common.dto.AuthResponse;
import com.nexmart.common.dto.UserDTO;
import com.nexmart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(Role.CUSTOMER)
                .build();

        user = userRepository.save(user);
        log.info("Registered new user: {} with role CUSTOMER", user.getEmail());

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (user.getIsLocked()) {
            throw new IllegalStateException("Account is locked. Contact support.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        log.info("User logged in: {}", user.getEmail());
        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken storedToken = refreshTokenRepository.findByTokenAndRevokedFalse(refreshTokenStr)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired refresh token"));

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new IllegalArgumentException("Refresh token has expired");
        }

        // Rotate: revoke old, issue new
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        User user = storedToken.getUser();
        log.info("Token refreshed for user: {}", user.getEmail());
        return generateAuthResponse(user);
    }

    @Transactional
    public void logout(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        refreshTokenRepository.revokeAllByUser(user);
        log.info("All refresh tokens revoked for user: {}", user.getEmail());
    }

    public UserDTO getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapToDTO(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getRole().name());
        String refreshTokenStr = jwtService.generateRefreshToken(user.getId());

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenStr)
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(jwtService.getRefreshTokenExpirationMs() / 1000))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .user(mapToDTO(user))
                .build();
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .membershipLevel(user.getMembershipLevel())
                .build();
    }
}
