"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Grid, List, SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCard } from "@/components/products/product-card";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { useInView } from "react-intersection-observer";
import type { ProductFilters } from "@/types";

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "best_seller", label: "Best Sellers" },
];

const brands = ["Apple", "Samsung", "Sony", "Nike", "Dyson", "Amazon", "LG"];
const priceRanges = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 - ₹20,000", min: 5000, max: 20000 },
  { label: "₹20,000 - ₹50,000", min: 20000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "Above ₹1,00,000", min: 100000, max: Infinity },
];

function FilterSidebar({
  filters,
  onFilterChange,
  onClose,
}: {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onClose?: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider">
          Category
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onFilterChange({ ...filters, category: undefined })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              !filters.category ? "bg-primary/15 text-primary font-medium" : "text-text-secondary hover:bg-surface-2"
            }`}
          >
            All Categories
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.slug })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                filters.category === cat.slug
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.icon}</span>
                {cat.name}
              </span>
              <span className="text-xs text-text-muted">{cat.productCount.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider">
          Price Range
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  minPrice: range.min,
                  maxPrice: range.max === Infinity ? undefined : range.max,
                })
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                filters.minPrice === range.min
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider">
          Customer Rating
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange({ ...filters, rating })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                filters.rating === rating
                  ? "bg-primary/15 text-primary font-medium"
                  : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              <span>{"⭐".repeat(rating)}</span>
              <span>{rating}+ Stars</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider">
          Brand
        </h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) ?? false}
                onChange={(e) => {
                  const brands = filters.brands ?? [];
                  onFilterChange({
                    ...filters,
                    brands: e.target.checked
                      ? [...brands, brand]
                      : brands.filter((b) => b !== brand),
                  });
                }}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wider">
          Availability
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked || undefined })}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-text-secondary">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input
            type="checkbox"
            checked={filters.isFlashSale ?? false}
            onChange={(e) => onFilterChange({ ...filters, isFlashSale: e.target.checked || undefined })}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-sm text-text-secondary">Flash Sale</span>
        </label>
      </div>

      {/* Clear */}
      <button
        onClick={() => onFilterChange({})}
        className="w-full py-2.5 rounded-xl border border-danger/30 text-danger text-sm font-medium hover:bg-danger/10 transition-all"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sort, setSort] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { ref: loadMoreRef, inView } = useInView();

  const PAGE_SIZE = 8;

  // Filter and sort products
  const filteredProducts = mockProducts.filter((p) => {
    if (filters.category && p.category.slug !== filters.category) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.rating && p.rating < filters.rating) return false;
    if (filters.brands?.length && !filters.brands.includes(p.brand)) return false;
    if (filters.inStock && p.stock === 0) return false;
    if (filters.isFlashSale && !p.isFlashSale) return false;
    return true;
  }).sort((a, b) => {
    switch (sort) {
      case "price_low": return a.price - b.price;
      case "price_high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });

  const paginatedProducts = filteredProducts.slice(0, page * PAGE_SIZE);

  useEffect(() => {
    if (inView && paginatedProducts.length < filteredProducts.length) {
      setPage((p) => p + 1);
    }
  }, [inView]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-text-primary">
              All Products
            </h1>
            <p className="text-text-muted mt-1">
              Showing {filteredProducts.length.toLocaleString()} products
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-text-primary flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <span className="badge badge-primary">{activeFilterCount}</span>
                  )}
                </div>
                <FilterSidebar filters={filters} onFilterChange={setFilters} />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6 bg-surface border border-border rounded-2xl p-4">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-sm font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="badge badge-primary py-0">{activeFilterCount}</span>
                  )}
                </button>

                <div className="flex-1" />

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-muted hidden sm:block">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input text-sm py-2 rounded-xl pr-8 cursor-pointer"
                    style={{ width: "auto" }}
                    id="sort-select"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white" : "text-text-muted hover:text-text-primary"}`}
                    title="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-text-muted hover:text-text-primary"}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.category && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                      Category: {filters.category}
                      <button onClick={() => setFilters({ ...filters, category: undefined })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                      Min: ₹{filters.minPrice.toLocaleString()}
                      <button onClick={() => setFilters({ ...filters, minPrice: undefined })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.brands?.map((brand) => (
                    <span key={brand} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                      {brand}
                      <button onClick={() => setFilters({ ...filters, brands: filters.brands?.filter((b) => b !== brand) })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Products Grid */}
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="font-display font-bold text-xl text-text-primary mb-2">No products found</h3>
                  <p className="text-text-muted">Try adjusting your filters</p>
                  <button
                    onClick={() => setFilters({})}
                    className="mt-6 btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                  : "space-y-4"
                }>
                  {paginatedProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      variant={viewMode === "list" ? "horizontal" : "default"}
                    />
                  ))}
                </div>
              )}

              {/* Load More Trigger */}
              {paginatedProducts.length < filteredProducts.length && (
                <div ref={loadMoreRef} className="flex justify-center mt-10">
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                onClick={() => setMobileFilterOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28 }}
                className="fixed left-0 top-0 bottom-0 w-80 glass-dark border-r border-border z-50 overflow-y-auto p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-xl text-text-primary">Filters</h2>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-2 rounded-xl hover:bg-surface-2 text-text-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onClose={() => setMobileFilterOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
