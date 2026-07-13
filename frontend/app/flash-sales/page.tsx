"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Clock, Tag, SlidersHorizontal, Search, Filter, X } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCard } from "@/components/products/product-card";
import { mockProducts } from "@/lib/mock-data";

// Flash-sale end time: next midnight
function getFlashSaleEnd() {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  return d.getTime();
}

function useCountdown(targetMs: number) {
  const calc = useCallback(() => {
    const diff = Math.max(0, targetMs - Date.now());
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    return { h, m, s, done: diff === 0 };
  }, [targetMs]);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
}

const pad = (n: number) => String(n).padStart(2, "0");

const sortOptions = [
  { value: "discount", label: "Biggest Discount" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function FlashSalesPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [sort, setSort] = useState("discount");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const flashEnd = getFlashSaleEnd();
  const countdown = useCountdown(flashEnd);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("nexmart-products");
      setAllProducts(raw ? JSON.parse(raw) : mockProducts);
    }
  }, []);

  // Only approved flash-sale products
  const flashProducts = allProducts.filter(
    (p) => p.isFlashSale && (p.approved !== false)
  );

  // Unique categories among flash products
  const categories = Array.from(
    new Set(flashProducts.map((p) => p.category?.name).filter(Boolean))
  ) as string[];

  // Apply search + category filter
  const filtered = flashProducts.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !categoryFilter || p.category?.name === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "discount") return (b.discount || 0) - (a.discount || 0);
    if (sort === "price_low") return a.price - b.price;
    if (sort === "price_high") return b.price - a.price;
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const totalSavings = sorted.reduce(
    (sum, p) => sum + ((p.originalPrice || p.price) - p.price),
    0
  );

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-24 pb-20">

        {/* ── Hero Banner ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0030] via-[#0d0020] to-background px-6 py-16 text-center">
          {/* Animated background orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-yellow-500/15 blur-[100px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/20 border border-warning/40 text-warning text-sm font-bold mb-4">
              <Zap className="w-4 h-4 fill-warning" /> LIMITED TIME DEALS
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white mb-3 tracking-tight">
              ⚡ Flash Sales
            </h1>
            <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Hand-picked deals at unbeatable prices. Every hour counts — grab yours before time runs out!
            </p>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-warning" />
              <span className="text-white/60 text-sm font-medium">Ends in</span>
              {[
                { label: "HRS", val: pad(countdown.h) },
                { label: "MIN", val: pad(countdown.m) },
                { label: "SEC", val: pad(countdown.s) },
              ].map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-2">
                  {i > 0 && <span className="text-warning font-bold text-xl">:</span>}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={unit.val}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-display font-black text-2xl text-white"
                        >
                          {unit.val}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <span className="text-[10px] text-white/40 font-bold mt-1 tracking-wider">{unit.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-white/70">
                <Sparkles className="w-4 h-4 text-warning" />
                <span><span className="font-bold text-white">{flashProducts.length}</span> products on sale</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Tag className="w-4 h-4 text-success" />
                <span>Save up to <span className="font-bold text-success">
                  ₹{totalSavings.toLocaleString("en-IN")}
                </span> total</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── Filters & Search Bar ── */}
        <div className="sticky top-20 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 bg-surface border border-border rounded-xl px-4 py-2.5">
              <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Search flash sale products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-text-primary placeholder-text-muted w-full"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-text-muted hover:text-text-primary">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Category toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${showFilters ? "bg-primary text-white border-primary" : "border-border text-text-secondary hover:text-text-primary"}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Categories
            </button>
          </div>

          {/* Category pills */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategoryFilter(null)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${!categoryFilter ? "bg-primary text-white border-primary" : "border-border text-text-secondary hover:border-primary hover:text-primary"}`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat === categoryFilter ? null : cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${categoryFilter === cat ? "bg-primary text-white border-primary" : "border-border text-text-secondary hover:border-primary hover:text-primary"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Product Grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          {sorted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <Sparkles className="w-14 h-14 text-warning/40 mx-auto mb-4" />
              <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
                {flashProducts.length === 0 ? "No Flash Sales Active" : "No Results Found"}
              </h2>
              <p className="text-text-muted text-sm max-w-sm mx-auto">
                {flashProducts.length === 0
                  ? "The admin hasn't started any flash sales yet. Check back soon!"
                  : "Try a different search term or clear the category filter."}
              </p>
              {(search || categoryFilter) && (
                <button
                  onClick={() => { setSearch(""); setCategoryFilter(null); }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-text-muted text-sm">
                  Showing <span className="font-bold text-text-primary">{sorted.length}</span> flash sale deals
                  {categoryFilter && <> in <span className="text-primary font-semibold">{categoryFilter}</span></>}
                </p>
              </div>

              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                <AnimatePresence>
                  {sorted.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      className="relative"
                    >
                      {/* Flash sale badge overlay */}
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning text-black text-[10px] font-black shadow-lg">
                        <Zap className="w-3 h-3 fill-black" />
                        {product.discount}% OFF
                      </div>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
