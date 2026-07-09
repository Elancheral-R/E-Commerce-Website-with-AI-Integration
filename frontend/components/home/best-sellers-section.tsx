"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, Trophy, Sparkles, Flame } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { bestSellers, trendingProducts, mockProducts } from "@/lib/mock-data";

const tabs = [
  { id: "bestsellers", label: "Best Sellers", icon: Trophy, products: bestSellers, color: "from-amber-500 to-orange-500" },
  { id: "trending", label: "Trending Now", icon: Flame, products: trendingProducts, color: "from-danger to-pink-500" },
  { id: "new", label: "New Arrivals", icon: Sparkles, products: mockProducts.filter(p => p.isNew), color: "from-primary to-secondary" },
];

export function BestSellersSection() {
  const [activeTab, setActiveTab] = useState("bestsellers");
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute top-0 left-0 w-[600px] h-[400px] rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgb(99 102 241 / 0.3) 0%, transparent 65%)" }} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <span className="section-label mb-4 inline-flex">
              <TrendingUp className="w-3 h-3" />
              Curated by AI
            </span>
            <h2 className="heading-lg text-text-primary mt-3">
              Top Products
            </h2>
            <p className="text-text-muted mt-2">
              Curated by millions of shoppers and our AI
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface-2 border border-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color} shadow-lg`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10 hidden sm:block">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {current.products.slice(0, 8).map((product, i) => (
              <div key={product.id} className="relative">
                {/* Rank overlay for top 3 */}
                {i < 3 && (
                  <div className={`absolute -top-2 -left-2 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow-xl ${
                    i === 0
                      ? "bg-gradient-to-br from-amber-400 to-amber-600"
                      : i === 1
                      ? "bg-gradient-to-br from-slate-300 to-slate-500"
                      : "bg-gradient-to-br from-amber-700 to-amber-900"
                  }`}>
                    #{i + 1}
                  </div>
                )}
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-primary/25 text-primary font-bold hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_8px_30px_rgb(99_102_241/0.4)] transition-all duration-300 group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
