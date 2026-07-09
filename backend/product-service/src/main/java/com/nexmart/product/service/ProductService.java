package com.nexmart.product.service;

import com.nexmart.common.exception.ResourceNotFoundException;
import com.nexmart.product.entity.Category;
import com.nexmart.product.entity.Product;
import com.nexmart.product.entity.Review;
import com.nexmart.product.repository.CategoryRepository;
import com.nexmart.product.repository.ProductRepository;
import com.nexmart.product.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Cacheable(value = "product", key = "#slug")
    public Product getProductBySlug(String slug) {
        log.info("Fetching product from Database for slug: {}", slug);
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
    }

    public List<Product> getProductsByCategory(UUID categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Cacheable(value = "categories")
    public List<Category> getAllCategories() {
        log.info("Fetching categories from Database");
        return categoryRepository.findAll();
    }

    @Cacheable(value = "flash-sales")
    public List<Product> getFlashSaleProducts() {
        log.info("Fetching flash sale products");
        return productRepository.findByIsFlashSaleTrue();
    }

    public List<Product> getBestSellerProducts() {
        return productRepository.findByIsBestSellerTrue();
    }

    public List<Product> search(String query) {
        return productRepository.searchProducts(query);
    }

    @Transactional
    @CacheEvict(value = "product", key = "#product.slug")
    public Product saveProduct(Product product) {
        log.info("Saving product to Database: {}", product.getName());
        return productRepository.save(product);
    }

    public List<Review> getReviewsForProduct(UUID productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Transactional
    public Review saveReview(UUID productId, Review review) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        review.setProduct(product);
        Review saved = reviewRepository.save(review);

        // Update product statistics
        List<Review> allReviews = reviewRepository.findByProductId(productId);
        double avgRating = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setRating(avgRating);
        product.setReviewCount(allReviews.size());
        productRepository.save(product);

        return saved;
    }
}
