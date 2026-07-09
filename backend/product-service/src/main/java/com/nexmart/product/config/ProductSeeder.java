package com.nexmart.product.config;

import com.nexmart.product.entity.Category;
import com.nexmart.product.entity.Product;
import com.nexmart.product.repository.CategoryRepository;
import com.nexmart.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Seeder: Products already seeded — skipping.");
            return;
        }

        log.info("Seeder: Initializing product catalog with demo data...");

        Category electronics = categoryRepository.save(Category.builder()
                .name("Electronics").slug("electronics").icon("💻").color("#6366f1").build());

        Category fashion = categoryRepository.save(Category.builder()
                .name("Fashion").slug("fashion").icon("👟").color("#ec4899").build());

        Category appliances = categoryRepository.save(Category.builder()
                .name("Home Appliances").slug("home-appliances").icon("🏠").color("#f59e0b").build());

        Category sports = categoryRepository.save(Category.builder()
                .name("Sports").slug("sports").icon("⚽").color("#10b981").build());

        // Electronics
        productRepository.saveAll(List.of(
                Product.builder()
                        .name("Blade Pro 16 Intel i9 Gaming Laptop")
                        .slug("blade-pro-16-gaming-laptop")
                        .brand("Razer")
                        .description("Unleash performance with Intel Core i9, 32GB DDR5, RTX 4090 GPU.")
                        .price(new BigDecimal("88999"))
                        .originalPrice(new BigDecimal("99999"))
                        .stock(42)
                        .rating(4.8)
                        .reviewCount(124)
                        .discount(11)
                        .isBestSeller(true)
                        .isFlashSale(true)
                        .category(electronics)
                        .images(List.of("https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600"))
                        .build(),

                Product.builder()
                        .name("Noise-Cancelling Premium Studio Headphones")
                        .slug("studio-headphones-anc")
                        .brand("Sony")
                        .description("Industry-leading ANC, 30-hour battery, premium Hi-Res audio.")
                        .price(new BigDecimal("24999"))
                        .originalPrice(new BigDecimal("32000"))
                        .stock(87)
                        .rating(4.9)
                        .reviewCount(98)
                        .discount(22)
                        .isNew(true)
                        .isBestSeller(true)
                        .category(electronics)
                        .images(List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"))
                        .build(),

                Product.builder()
                        .name("Pro Max 15 Titanium Smartphone")
                        .slug("pro-max-15-titanium")
                        .brand("Apple")
                        .description("A17 Pro chip, 48MP camera, titanium build, USB-C 3 support.")
                        .price(new BigDecimal("134900"))
                        .originalPrice(new BigDecimal("134900"))
                        .stock(200)
                        .rating(4.7)
                        .reviewCount(346)
                        .discount(0)
                        .isBestSeller(true)
                        .category(electronics)
                        .images(List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"))
                        .build()
        ));

        // Fashion
        productRepository.saveAll(List.of(
                Product.builder()
                        .name("Zoom Vaporfly 3 Carbon Road Racer")
                        .slug("zoom-vaporfly-3-carbon")
                        .brand("Nike")
                        .description("Competition-grade racing shoe with ZoomX foam & carbon fibre plate.")
                        .price(new BigDecimal("19999"))
                        .originalPrice(new BigDecimal("24999"))
                        .stock(15)
                        .rating(4.8)
                        .reviewCount(64)
                        .discount(20)
                        .isFlashSale(true)
                        .category(fashion)
                        .images(List.of("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"))
                        .build(),

                Product.builder()
                        .name("Ultraboost 23 Running Shoe")
                        .slug("ultraboost-23-running")
                        .brand("Adidas")
                        .description("Responsive BOOST midsole, Primeknit upper for a perfect fit.")
                        .price(new BigDecimal("14999"))
                        .originalPrice(new BigDecimal("17999"))
                        .stock(50)
                        .rating(4.6)
                        .reviewCount(87)
                        .discount(17)
                        .isNew(true)
                        .category(fashion)
                        .images(List.of("https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"))
                        .build()
        ));

        // Appliances
        productRepository.saveAll(List.of(
                Product.builder()
                        .name("InstaView French Door Refrigerator 694L")
                        .slug("instaview-french-door-fridge-694l")
                        .brand("LG")
                        .description("Knock twice to see inside without opening — with InstaView™ Door-in-Door®.")
                        .price(new BigDecimal("129999"))
                        .originalPrice(new BigDecimal("159999"))
                        .stock(8)
                        .rating(4.5)
                        .reviewCount(22)
                        .discount(19)
                        .category(appliances)
                        .images(List.of("https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600"))
                        .build()
        ));

        // Sports
        productRepository.saveAll(List.of(
                Product.builder()
                        .name("Echo Smart Fitness Tracker")
                        .slug("echo-smart-fitness-tracker")
                        .brand("Fitbit")
                        .description("Heart rate, SpO2, sleep score, stress management & GPS built-in.")
                        .price(new BigDecimal("8999"))
                        .originalPrice(new BigDecimal("11999"))
                        .stock(300)
                        .rating(4.4)
                        .reviewCount(188)
                        .discount(25)
                        .isNew(true)
                        .isFlashSale(true)
                        .category(sports)
                        .images(List.of("https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600"))
                        .build()
        ));

        log.info("Seeder: ✅ Product catalog seeded successfully ({} products).", productRepository.count());
    }
}
