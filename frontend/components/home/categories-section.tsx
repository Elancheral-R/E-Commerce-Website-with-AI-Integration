"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { mockCategories } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function CategoriesSection() {
  const featured = mockCategories[0];
  const rest = mockCategories.slice(1, 7);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 65%)" }} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="section-label mb-4 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Collections
            </span>
            <h2 className="heading-lg text-text-primary mt-3">
              Shop by{" "}
              <span className="relative">
                Category
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-[2.5px] rounded-full bg-primary origin-left block"
                />
              </span>
            </h2>
            <p className="text-text-muted mt-3 text-base max-w-sm">
              Explore our curated collection across {mockCategories.length} categories
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 text-text-secondary hover:text-primary text-sm font-semibold transition-all group"
          >
            All Categories
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {/* Featured (large) */}
          <motion.div variants={itemVariants} className="col-span-2 row-span-2">
            <Link href={`/products?category=${featured.slug}`} className="group block h-full min-h-[320px]">
              <div className="relative h-full rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  style={{ transform: "scale(1)", willChange: "transform" }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-slate-900/40"
                />

                {/* Content */}
                <div className="absolute inset-0 p-7 flex flex-col justify-end">
                  <div className="mb-3">
                    <span className="text-4xl mb-3 block">{featured.icon}</span>
                    <h3 className="font-display font-bold text-3xl text-white mb-1 group-hover:translate-y-[-2px] transition-transform duration-300">
                      {featured.name}
                    </h3>
                    <p className="text-white/60 text-sm">{formatNumber(featured.productCount)} products</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm font-medium">Explore now</span>
                    <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Smaller cards */}
          {rest.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link href={`/products?category=${category.slug}`} className="group block h-full min-h-[150px]">
                <div className="relative h-full rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/30"
                  />

                  {/* Content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className="text-2xl mb-1.5 block">{category.icon}</span>
                    <h3 className="font-display font-bold text-white text-base leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-white/50 text-xs mt-0.5">{formatNumber(category.productCount)}</p>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* "More" Card */}
          <motion.div variants={itemVariants}>
            <Link href="/categories" className="group block h-full min-h-[150px]">
              <div className="h-full rounded-2xl border border-dashed border-border hover:border-primary/40 bg-surface hover:bg-primary/3 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">More</p>
                  <p className="text-text-muted text-xs mt-0.5">{mockCategories.length}+ categories</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
