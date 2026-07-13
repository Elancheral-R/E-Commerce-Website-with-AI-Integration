"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Folder, Search, ArrowRight, Sparkles, ShoppingBag } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { mockCategories, mockProducts } from "@/lib/mock-data";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCats = localStorage.getItem("nexmart-categories");
      const storedProds = localStorage.getItem("nexmart-products");
      
      let cats = storedCats ? JSON.parse(storedCats) : mockCategories;
      const prods = storedProds ? JSON.parse(storedProds) : mockProducts;

      // Calculate dynamic counts based on active products in localStorage
      cats = cats.map((cat: any) => {
        const count = prods.filter((p: any) => p.category?.slug === cat.slug && p.approved !== false).length;
        return {
          ...cat,
          productCount: count > 0 ? count : (cat.productCount || Math.floor(Math.random() * 20) + 5)
        };
      });

      setCategories(cats);
    }
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0c0a20] via-[#020208] to-background px-6 py-16 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-[100px]" />
            <div className="absolute bottom-5 right-1/3 w-72 h-72 rounded-full bg-secondary/10 blur-[100px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Explore Departments
            </div>
            <h1 className="font-display font-black text-4xl sm:text-5xl text-text-primary tracking-tight">
              Browse by Category
            </h1>
            <p className="text-text-muted text-sm sm:text-base max-w-md mx-auto">
              Find exactly what you are looking for across our curated selections of high-quality goods.
            </p>

            {/* Search Categories */}
            <div className="max-w-md mx-auto mt-8 flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm text-text-primary placeholder-text-muted w-full"
              />
            </div>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <Folder className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-60" />
              <p className="text-text-secondary font-semibold">No categories found</p>
              <p className="text-text-muted text-xs mt-1">Try another search filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative h-80 rounded-3xl overflow-hidden border border-border bg-surface shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6"
                >
                  {/* Background Image */}
                  {cat.image ? (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-surface to-surface-2" />
                  )}

                  {/* Top Icon Badge */}
                  <div 
                    className="absolute top-6 left-6 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg z-20 backdrop-blur-md"
                    style={{ backgroundColor: `${cat.color || "#6366f1"}20`, border: `1px solid ${cat.color || "#6366f1"}40` }}
                  >
                    <span>{cat.icon || "📦"}</span>
                  </div>

                  {/* Content */}
                  <div className="relative z-20 space-y-2">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
                      {cat.productCount} Products
                    </span>
                    <h3 className="font-display font-bold text-2xl text-text-primary">
                      {cat.name}
                    </h3>
                    
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2.5 transition-all duration-300"
                    >
                      Browse Department <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
