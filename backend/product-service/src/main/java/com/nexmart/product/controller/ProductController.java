package com.nexmart.product.controller;

import com.nexmart.product.entity.Category;
import com.nexmart.product.entity.Product;
import com.nexmart.product.entity.Review;
import com.nexmart.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String query
    ) {
        if (query != null && !query.isBlank()) {
            return ResponseEntity.ok(productService.search(query));
        }
        if (categoryId != null && !categoryId.isBlank()) {
            return ResponseEntity.ok(productService.getProductsByCategory(UUID.fromString(categoryId)));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Product> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @GetMapping("/flash-sales")
    public ResponseEntity<List<Product>> getFlashSales() {
        return ResponseEntity.ok(productService.getFlashSaleProducts());
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<Product>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellerProducts());
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<Review>> getReviews(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getReviewsForProduct(id));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Review> createReview(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestBody Review review
    ) {
        if (userId != null) {
            review.setUserId(UUID.fromString(userId));
        }
        return ResponseEntity.ok(productService.saveReview(id, review));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }
}
