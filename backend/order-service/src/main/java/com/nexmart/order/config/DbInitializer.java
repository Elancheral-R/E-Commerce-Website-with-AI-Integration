package com.nexmart.order.config;

import com.nexmart.order.entity.Coupon;
import com.nexmart.order.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DbInitializer implements CommandLineRunner {

    private final CouponRepository couponRepository;

    @Override
    public void run(String... args) {
        if (couponRepository.count() == 0) {
            log.info("Seeding coupon database with mock promotions");
            couponRepository.save(Coupon.builder()
                    .code("NEXMART50")
                    .discountAmount(BigDecimal.valueOf(250))
                    .active(true)
                    .build());
            couponRepository.save(Coupon.builder()
                    .code("FREESHIP")
                    .discountAmount(BigDecimal.valueOf(99))
                    .active(true)
                    .build());
        }
    }
}
