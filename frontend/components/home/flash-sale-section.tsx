"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowRight, Flame } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { flashSaleProducts } from "@/lib/mock-data";

function useCountdown(targetTime: number) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  const prevRef = useRef(display);
  const changed = prevRef.current !== display;
  prevRef.current = display;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-20 perspective-[600px]">
        {/* Card face */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-surface-3 border border-border shadow-lg flex items-center justify-center">
          {/* Highlight line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />
          {/* Center divider */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-black/15 z-10" />

          <AnimatePresence mode="wait">
            <motion.span
              key={display}
              initial={{ y: changed ? "-100%" : 0, opacity: changed ? 0 : 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
              className="font-display font-black text-3xl text-text-primary z-20 relative"
            >
              {display}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function FlashSaleSection() {
  const endTime = useRef(Date.now() + 6 * 60 * 60 * 1000).current;
  const { hours, minutes, seconds } = useCountdown(endTime);
  const claimedPercent = 68;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dark dramatic background for this section */}
      <div className="absolute inset-0 bg-[#0a0812]" />
      {/* Red/orange ambient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgb(239 68 68 / 0.4) 0%, transparent 65%)" }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgb(245 158 11 / 0.4) 0%, transparent 65%)" }} />
      {/* Grid pattern */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12"
        >
          {/* Left: Title + Countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-danger/15 border border-danger/25 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-danger fill-danger" />
                </div>
                <span className="section-label section-label-danger">
                  <span className="live-dot" style={{ background: "#ef4444" }} />
                  Live Flash Sale
                </span>
              </div>
              <h2 className="heading-lg text-white">
                Flash Deals
              </h2>
              <p className="text-white/40 mt-1.5 text-sm">
                Up to 70% off — Grab before time runs out!
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-end gap-3">
              <FlipDigit value={hours} label="Hours" />
              <span className="text-white/40 font-bold text-3xl mb-7 leading-none">:</span>
              <FlipDigit value={minutes} label="Mins" />
              <span className="text-white/40 font-bold text-3xl mb-7 leading-none">:</span>
              <FlipDigit value={seconds} label="Secs" />
            </div>
          </div>

          {/* Right: Progress + CTA */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-white/50 font-medium">Deals claimed</span>
              <span className="text-danger font-bold">{claimedPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${claimedPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-danger to-orange-400"
              />
            </div>
            <p className="text-white/30 text-[11px]">Hurry — limited quantity per user</p>

            <Link
              href="/flash-sales"
              className="mt-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-danger/30 text-danger text-sm font-bold hover:bg-danger/10 transition-all group"
            >
              View All Deals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {flashSaleProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
