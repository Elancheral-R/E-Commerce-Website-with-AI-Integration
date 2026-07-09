package com.nexmart.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements Serializable {
    private UUID id;
    private String email;
    private String name;
    private String role; // CUSTOMER, SELLER, ADMIN, SUPPORT
    private String avatarUrl;
    private String membershipLevel; // regular, gold, platinum
}
