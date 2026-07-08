"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { flashSaleProducts } from "@/lib/mock-data";

function useCountdown(targetTime: number) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}

export function FlashSaleSection() {
  const endTime = Date.now() + 6 * 60 * 60 * 1000; // 6 hours from now
  const { hours, minutes, seconds } = useCountdown(endTime);

  return (
    <section className="py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-danger fill-danger" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl text-text-primary">Flash Sale</h2>
                <p className="text-text-muted text-sm">Up to 60% off — Limited time!</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" />
              <div className="flex items-center gap-1">
                {[
                  { value: hours, label: "h" },
                  { value: minutes, label: "m" },
                  { value: seconds, label: "s" },
                ].map(({ value, label }, i) => (
                  <div key={label} className="flex items-center gap-1">
                    {i > 0 && <span className="text-text-muted font-bold">:</span>}
                    <div className="flex items-center gap-0.5">
                      <motion.span
                        key={value}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="countdown-digit text-lg font-bold text-text-primary bg-surface-2 border border-border rounded-lg px-2 py-1 min-w-[2.5rem] text-center"
                      >
                        {String(value).padStart(2, "0")}
                      </motion.span>
                      <span className="text-xs text-text-muted">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/flash-sales"
            className="flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
          >
            View All Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flashSaleProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
