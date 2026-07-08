"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { mockCategories } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function CategoriesSection() {
  return (
    <section className="py-16 bg-surface-2">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl text-text-primary">Shop by Category</h2>
            <p className="text-text-muted mt-1">Explore our curated collection of {mockCategories.length} categories</p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
          >
            All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {mockCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/products?category=${category.slug}`}>
                <div className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-surface border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer text-center">
                  {/* Icon / Image */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 overflow-hidden"
                    style={{ background: `${category.color}20` }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <p className="font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatNumber(category.productCount)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden text-center mt-6">
          <Link href="/categories" className="text-primary font-semibold text-sm flex items-center justify-center gap-2">
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
