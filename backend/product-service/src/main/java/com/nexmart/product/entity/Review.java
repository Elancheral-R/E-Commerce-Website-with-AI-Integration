package com.nexmart.product.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private UUID userId;
    private String userName;
    private String userAvatar;

    private Integer rating;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Builder.Default
    private Boolean isVerifiedPurchase = false;

    @Builder.Default
    private Integer helpfulCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
