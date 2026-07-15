"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, ShoppingBag, Star,
  Shield, Truck, ChevronRight, TrendingUp, Users, Package,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { mockProducts } from "@/lib/mock-data";

const stats = [
  { label: "Active Customers", value: "10M+", icon: Users },
  { label: "Products Listed", value: "5M+", icon: Package },
  { label: "Verified Merchants", value: "50K+", icon: TrendingUp },
];

const trustBadges = [
  { icon: Shield, label: "Secure Transactions", sub: "Fully certified SSL" },
  { icon: Truck, label: "Expedited Delivery", sub: "Same day dispatch" },
  { icon: Star, label: "Top-Rated Service", sub: "4.9/5 satisfaction" },
];

const heroProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 3);

function ProductShowcase() {
  const [currentProduct, setCurrentProduct] = useState(0);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    const t = setInterval(() => setCurrentProduct((p) => (p + 1) % heroProducts.length), 4000);
    return () => clearInterval(t);
  }, []);

  const featured = heroProducts[currentProduct];

  return (
    <div className="relative">
      {/* Background shadow card accent */}
      <div className="absolute inset-0 bg-surface-2 rounded-2xl scale-102 border border-border/40 -z-10" />

      {/* Main card */}
      <div className="relative bg-surface rounded-2xl p-5 border border-border shadow-md">
        {/* Image area */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-surface-2">
          {heroProducts.map((product, i) => (
            <motion.img
              key={product.id}
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: i === currentProduct ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          ))}

          {/* Special tags */}
          {featured?.isFlashSale && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-danger text-white text-[10px] font-bold">
              Sale
            </div>
          )}

          {featured?.discount > 0 && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-success text-white text-[10px] font-bold">
              -{featured.discount}% Off
            </div>
          )}
        </div>

        {/* Product details */}
        <AnimatePresence mode="wait">
          {featured && (
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-1">{featured.brand}</p>
              <h3 className="font-display font-semibold text-base text-text-primary mb-2 line-clamp-1">{featured.name}</h3>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="text-xs font-bold text-text-primary">{featured.rating}</span>
                </div>
                <span className="text-xs text-text-muted">({featured.reviewCount.toLocaleString()})</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-xl text-text-primary">₹{featured.price.toLocaleString("en-IN")}</span>
                  {featured.originalPrice > featured.price && (
                    <span className="text-text-muted text-xs line-through ml-2">₹{featured.originalPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { addItem(featured); openCart(); }}
                    className="btn-primary py-2 px-3 text-xs rounded-lg font-semibold shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <Link
                    href={`/products/${featured.slug}`}
                    className="p-2 rounded-lg bg-surface-2 border border-border text-text-secondary hover:bg-surface hover:text-primary transition-all flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating features */}
      <div className="absolute -top-3 -right-3 bg-surface border border-border rounded-xl p-2.5 shadow-md flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-primary">AI Match</p>
          <p className="text-[9px] text-text-muted">Personalized pick</p>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-surface-2 via-surface to-background pt-36 pb-12 border-b border-border overflow-hidden">
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Commercial Pitch */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Commerce Built For You
            </div>

            {/* Headline */}
            <h1 className="heading-xl text-text-primary tracking-tight">
              Experience the Future of <span className="text-primary">Intelligent Shopping</span>
            </h1>

            <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
              Shop over 5 million products with personalized AI search, dynamic recommendations, and unified checkout. Everything you need, selected just for you.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary text-sm px-6 py-3 shadow-md">
                <ShoppingBag className="w-4 h-4" />
                Browse Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai-assistant"
                className="flex items-center gap-2 px-6 py-3 text-sm rounded-full border border-border bg-surface text-text-secondary font-semibold hover:border-primary/45 hover:bg-surface-2 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                Ask AI Assistant
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-lg text-text-primary">{stat.value}</p>
                  <p className="text-[11px] text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Showcase Card */}
          <div className="lg:col-span-5 relative">
            <ProductShowcase />
          </div>

        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-3 bg-surface p-3.5 rounded-xl border border-border shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0 border border-border">
                <badge.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-text-primary text-xs font-bold">{badge.label}</p>
                <p className="text-text-muted text-[10px]">{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
