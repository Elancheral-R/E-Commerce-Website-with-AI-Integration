package com.nexmart.inventory.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID productId;

    @Column(nullable = false)
    @Builder.Default
    private Integer availableQty = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer reservedQty = 0;
}
