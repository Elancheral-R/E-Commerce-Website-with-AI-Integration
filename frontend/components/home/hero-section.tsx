"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag, Zap, Star, Shield, Truck, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { mockProducts } from "@/lib/mock-data";

const stats = [
  { label: "Happy Customers", value: "10M+", icon: "👥" },
  { label: "Products Listed", value: "5M+", icon: "📦" },
  { label: "Trusted Sellers", value: "50K+", icon: "🏪" },
  { label: "Cities Delivered", value: "500+", icon: "🚚" },
];

const trustBadges = [
  { icon: Shield, label: "Secure Payments", sub: "256-bit SSL encryption" },
  { icon: Truck, label: "Fast Delivery", sub: "Same day in 50+ cities" },
  { icon: Star, label: "Top Rated", sub: "4.9/5 average rating" },
  { icon: Zap, label: "AI Powered", sub: "Smart recommendations" },
];

const heroProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 3);

export function HeroSection() {
  const [currentProduct, setCurrentProduct] = useState(0);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % heroProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const featured = heroProducts[currentProduct];

  return (
    <section className="relative min-h-screen hero-bg flex flex-col pt-24 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
            top: "-100px",
            left: "-100px",
          }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
            bottom: "-100px",
            right: "-100px",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="flex-1 max-w-[1400px] mx-auto px-4 md:px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary mb-6"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Smart Commerce Platform
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-white mb-6"
            >
              Shop Smarter
              <br />
              <span className="gradient-text">with AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg"
            >
              Experience personalized shopping powered by AI — with smart recommendations, 
              dynamic pricing, voice search, and real-time inventory across 5 million+ products.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/products"
                className="btn-primary flex items-center gap-2 px-8 py-3.5 text-base glow-primary"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai-assistant"
                className="flex items-center gap-2 px-8 py-3.5 text-base rounded-full glass border border-white/10 text-white font-semibold hover:border-primary/40 hover:bg-primary/10 transition-all"
              >
                <Sparkles className="w-5 h-5 text-primary" />
                Try AI Assistant
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-display font-bold text-xl text-white">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main product card */}
            <div className="relative glass-card rounded-3xl p-6 border border-white/10">
              {/* Product image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-surface-2">
                {heroProducts.map((product, i) => (
                  <motion.img
                    key={product.id}
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{ opacity: i === currentProduct ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}

                {/* Play Video Overlay */}
                <button className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-16 h-16 rounded-full glass border border-white/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </button>

                {/* Flash sale timer */}
                {featured?.isFlashSale && (
                  <div className="absolute top-3 left-3 badge badge-danger">
                    <Zap className="w-3 h-3" />
                    Flash Sale
                  </div>
                )}
              </div>

              {/* Product info */}
              {featured && (
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                    {featured.brand}
                  </p>
                  <h3 className="font-display font-bold text-xl text-white mb-3 line-clamp-2">
                    {featured.name}
                  </h3>

                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <span className="font-bold text-2xl text-white">
                        ₹{featured.price.toLocaleString()}
                      </span>
                      {featured.originalPrice > featured.price && (
                        <span className="text-white/40 text-sm line-through ml-2">
                          ₹{featured.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {featured.discount > 0 && (
                      <span className="badge badge-success">{featured.discount}% off</span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { addItem(featured); openCart(); }}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 rounded-xl"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${featured.slug}`}
                      className="px-4 py-3 rounded-xl glass border border-white/10 text-white hover:border-primary/40 transition-all flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {heroProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentProduct(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === currentProduct ? "w-8 bg-primary" : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 glass border border-white/10 rounded-2xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">AI Recommended</p>
                  <p className="text-white/50 text-[10px]">Based on your style</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 glass border border-white/10 rounded-2xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">4.9★ Rating</p>
                  <p className="text-white/50 text-[10px]">2.8M+ reviews</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/5 glass-dark">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-primary" />
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
