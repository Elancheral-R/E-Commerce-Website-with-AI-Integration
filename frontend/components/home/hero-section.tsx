"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, ShoppingBag, Zap, Star,
  Shield, Truck, ChevronRight, TrendingUp, Users, Package,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { mockProducts } from "@/lib/mock-data";

const stats = [
  { label: "Customers", value: "10M+", icon: Users },
  { label: "Products", value: "5M+", icon: Package },
  { label: "Sellers", value: "50K+", icon: TrendingUp },
  { label: "Cities", value: "500+", icon: Truck },
];

const trustBadges = [
  { icon: Shield, label: "Secure Payments", sub: "256-bit SSL" },
  { icon: Truck, label: "Same Day Delivery", sub: "50+ cities" },
  { icon: Star, label: "Top Rated", sub: "4.9/5 avg rating" },
  { icon: Zap, label: "AI Powered", sub: "Smart recommendations" },
];

const words = ["Smarter", "Faster", "Better"];

const heroProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 3);

function AnimatedWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
          className="block gradient-text"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ProductShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentProduct, setCurrentProduct] = useState(0);
  const { addItem, openCart } = useCartStore();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  useEffect(() => {
    const t = setInterval(() => setCurrentProduct((p) => (p + 1) % heroProducts.length), 4000);
    return () => clearInterval(t);
  }, []);

  const featured = heroProducts[currentProduct];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="relative"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-electric/20 rounded-3xl blur-3xl scale-110 opacity-60" />

      {/* Main card */}
      <div className="relative glass-card rounded-3xl p-5 border border-white/10 shadow-2xl">
        {/* Image area */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-surface-2">
          {heroProducts.map((product, i) => (
            <motion.img
              key={product.id}
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: i === currentProduct ? 1 : 0, scale: i === currentProduct ? 1 : 1.04 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Flash sale badge */}
          {featured?.isFlashSale && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger text-white text-xs font-black shadow-lg">
              <Zap className="w-3 h-3 fill-white" />
              FLASH SALE
            </div>
          )}

          {/* Discount badge */}
          {featured?.discount > 0 && (
            <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center shadow-lg">
              <span className="text-white text-[10px] font-black text-center leading-tight">-{featured.discount}%</span>
            </div>
          )}
        </div>

        {/* Product info */}
        <AnimatePresence mode="wait">
          {featured && (
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.12em] mb-1.5">{featured.brand}</p>
              <h3 className="font-display font-bold text-lg text-white mb-3 line-clamp-1">{featured.name}</h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(featured.rating) ? "fill-accent text-accent" : "fill-surface-3 text-surface-3"}`} />
                  ))}
                </div>
                <span className="text-xs text-white/50">{featured.rating} ({featured.reviewCount.toLocaleString()})</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-2xl text-white">₹{featured.price.toLocaleString()}</span>
                  {featured.originalPrice > featured.price && (
                    <span className="text-white/40 text-sm line-through ml-2">₹{featured.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { addItem(featured); openCart(); }}
                    className="btn-primary flex items-center gap-1.5 py-2.5 px-4 text-sm rounded-xl"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add
                  </button>
                  <Link
                    href={`/products/${featured.slug}`}
                    className="p-2.5 rounded-xl frosted border border-white/10 text-white hover:border-primary/40 hover:bg-primary/10 transition-all flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {heroProducts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentProduct(i)}
              className={`h-1.5 rounded-full transition-all duration-400 ${i === currentProduct ? "w-8 bg-primary" : "w-1.5 bg-white/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Floating AI badge */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -right-5 glass border border-primary/20 rounded-2xl p-3 shadow-2xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-xs font-bold">AI Recommended</p>
            <p className="text-white/50 text-[10px]">Based on your style</p>
          </div>
        </div>
      </motion.div>

      {/* Floating rating badge */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute -bottom-5 -left-5 glass border border-success/20 rounded-2xl p-3 shadow-2xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-success fill-success" />
          </div>
          <div>
            <p className="text-white text-xs font-bold">4.9★ Rating</p>
            <p className="text-white/50 text-[10px]">2.8M+ reviews</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen hero-bg flex flex-col pt-28 overflow-hidden">
      {/* Background orbs */}
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />
      <div className="hero-orb-3" />
      <div className="dot-grid opacity-40" />

      {/* Animated mesh */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgb(99 102 241 / 0.15) 0%, transparent 65%)",
          top: "-150px", left: "5%",
        }}
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, delay: 3 }}
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgb(59 130 246 / 0.12) 0%, transparent 65%)",
          bottom: "0", right: "5%",
        }}
      />

      {/* Main Content */}
      <div className="flex-1 max-w-[1400px] mx-auto px-4 md:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left: Copy */}
          <div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-semibold text-primary mb-7"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Smart Commerce Platform
              <span className="live-dot" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="heading-hero text-white mb-2">
                Shop{" "}
              </h1>
              <h1 className="heading-hero text-white mb-2 h-[1.1em]">
                <AnimatedWord />
              </h1>
              <h1 className="heading-hero text-white mb-6">
                with{" "}
                <span className="gradient-text">AI</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-white/55 leading-relaxed mb-9 max-w-md"
            >
              Personalized shopping powered by intelligence — smart recommendations,
              dynamic pricing, voice search, and real-time inventory across 5 million+ products.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <Link href="/products" className="btn-primary text-base px-8 py-4 glow-primary">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai-assistant"
                className="flex items-center gap-2.5 px-8 py-4 text-base rounded-full glass border border-white/10 text-white font-semibold hover:border-primary/40 hover:bg-primary/8 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                Try AI Assistant
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="grid grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <p className="font-display font-bold text-xl text-white">{stat.value}</p>
                  <p className="text-[11px] text-white/45 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative px-8"
          >
            <ProductShowcase />
          </motion.div>
        </div>
      </div>

      {/* Trust Badges — Marquee */}
      <div className="border-t border-white/6 glass-dark relative z-10">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{badge.label}</p>
                  <p className="text-white/40 text-xs">{badge.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
