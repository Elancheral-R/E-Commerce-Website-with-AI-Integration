package com.nexmart.product.repository;

import com.nexmart.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByCategoryId(UUID categoryId);
    List<Product> findByIsFlashSaleTrue();
    List<Product> findByIsBestSellerTrue();

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(String query);
}
