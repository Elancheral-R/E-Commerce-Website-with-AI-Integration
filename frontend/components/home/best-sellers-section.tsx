"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { bestSellers, trendingProducts } from "@/lib/mock-data";
import { useState } from "react";

const tabs = [
  { id: "bestsellers", label: "Best Sellers", icon: "🏆", products: bestSellers },
  { id: "trending", label: "Trending Now", icon: "🔥", products: trendingProducts },
];

export function BestSellersSection() {
  const [activeTab, setActiveTab] = useState("bestsellers");
  const current = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section className="py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl text-text-primary flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-primary" />
              Top Products
            </h2>
            <p className="text-text-muted mt-1">Curated by millions of shoppers and our AI</p>
          </div>

          <div className="flex items-center gap-2 bg-surface-2 p-1 rounded-xl border border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {current.products.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary/30 text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-200"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
