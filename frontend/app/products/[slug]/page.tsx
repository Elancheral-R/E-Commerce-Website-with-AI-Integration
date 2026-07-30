"use client";

import { useState, use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Heart, Star, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Share2, Zap, Package, Award, Plus, Minus, MessageSquare, ShieldCheck, PenLine
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCard } from "@/components/products/product-card";
import { ReviewModal } from "@/components/products/review-modal";
import { mockReviews } from "@/lib/mock-data";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useAuthStore } from "@/lib/store/auth";
import { formatCurrency, getDiscountPercentage, cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Mock price history generator for product analytics
const priceHistory = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    price: Math.floor(Math.random() * 20000 + 175000),
  };
});

const deliveryOptions = [
  { label: "Standard Delivery", time: "3-5 business days", price: 0, icon: Truck },
  { label: "Express Delivery", time: "1-2 business days", price: 149, icon: Zap },
  { label: "Same Day Delivery", time: "Today by 9 PM", price: 299, icon: Package },
];

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const decodedSlug = decodeURIComponent(slug || "");

  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "qna" | "price">("details");
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [pincode, setPincode] = useState("");

  const loadProducts = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexmart-products");
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    loadProducts();
  }, []);

  // Find product by slug or id
  const product = products.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      p.slug === decodedSlug ||
      p.id === decodedSlug
  );

  // Load reviews for current product
  const loadUserReviews = () => {
    if (typeof window !== "undefined" && product) {
      const all: any[] = JSON.parse(localStorage.getItem("nexmart-reviews") || "[]");
      setUserReviews(all.filter((r) => r.productId === product.id));
    }
  };

  useEffect(() => {
    if (product) loadUserReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Loading state skeleton (Requirement #8)
  if (!mounted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-text-muted text-sm font-medium">Loading product details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 404 Product Not Found State (Requirement #9)
  if (!product) {
    return (
      <>
        <Header />
        <CartDrawer />
        <main className="min-h-screen bg-background pt-32 pb-24 flex items-center justify-center">
          <div className="text-center p-10 glass-card rounded-3xl border border-border max-w-lg bg-surface shadow-2xl space-y-5 mx-4">
            <div className="w-20 h-20 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto text-4xl font-bold">
              404
            </div>
            <h1 className="font-display font-bold text-3xl text-text-primary">Product Not Found</h1>
            <p className="text-text-muted text-sm max-w-sm mx-auto leading-relaxed">
              The product you are trying to view does not exist, has been removed, or is no longer available.
            </p>
            <div className="pt-2">
              <Link href="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl shadow-lg">
                Return to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Safe Property Accessors (prevents runtime crashes)
  const categoryName = typeof product.category === "object" ? (product.category?.name || "General") : (product.category || "General");
  const categorySlug = typeof product.category === "object" ? (product.category?.slug || "all") : (product.category || "all");
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=90"];
  const specifications = product.specifications && typeof product.specifications === "object"
    ? product.specifications
    : {
        "Brand": product.brand || "Generic",
        "Category": categoryName,
        "SKU": product.sku || "N/A",
        "Stock Status": `${product.stock || 0} units available`
      };
  const seller = product.seller || { name: "Verified Merchant", rating: 5.0, verified: true, totalSales: 100 };
  const rating = product.rating ?? 5.0;
  const reviewCount = product.reviewCount ?? 0;
  const returnPolicy = product.returnPolicy || "30-day return policy";
  const warranty = product.warranty || "1 year manufacturer warranty";
  const price = product.price || 0;
  const originalPrice = product.originalPrice || price;
  const discount = getDiscountPercentage(originalPrice, price);
  const wishlisted = isWishlisted(product.id);

  // Related products (up to 8, excluding current) (Requirement #7)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.slug !== product.slug)
    .filter((p) => {
      const pCat = typeof p.category === "object" ? p.category?.slug : p.category;
      return pCat === categorySlug || !categorySlug;
    })
    .slice(0, 8);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 3000);
    // Deduct stock dynamically in localStorage
    if (typeof window !== "undefined") {
      const storedProds = localStorage.getItem("nexmart-products");
      if (storedProds) {
        const allProds = JSON.parse(storedProds);
        const updated = allProds.map((p: any) =>
          p.id === product.id ? { ...p, stock: Math.max(0, (p.stock || 0) - quantity) } : p
        );
        localStorage.setItem("nexmart-products", JSON.stringify(updated));
        setProducts(updated);
      }
    }
  };

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: mockReviews.filter((r) => r.rating === stars).length,
    pct: Math.round((mockReviews.filter((r) => r.rating === stars).length / (mockReviews.length || 1)) * 100),
  }));

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-28 pb-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.06] pointer-events-none bg-gradient-to-br from-primary to-secondary" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.04] pointer-events-none bg-gradient-to-br from-electric to-cyan-400" />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-8 tracking-wider uppercase font-semibold overflow-x-auto py-1">
            <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors whitespace-nowrap">Products</Link>
            <span>/</span>
            <Link
              href={`/products?category=${categorySlug}`}
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Product Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
            
            {/* Left: Interactive Media Gallery (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden glass border border-border bg-surface-2 shadow-2xl flex items-center justify-center group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage] || images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover relative z-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </AnimatePresence>

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface/80 backdrop-blur-md border border-border flex items-center justify-center text-text-primary hover:bg-primary hover:text-white transition-all shadow-xl z-20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface/80 backdrop-blur-md border border-border flex items-center justify-center text-text-primary hover:bg-primary hover:text-white transition-all shadow-xl z-20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Custom badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                  {product.isNew && <span className="badge badge-primary shadow-lg">NEW ARRIVAL</span>}
                  {product.isBestSeller && (
                    <span className="badge badge-warning shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> BESTSELLER
                    </span>
                  )}
                  {product.isFlashSale && (
                    <span className="badge badge-danger shadow-lg animate-pulse flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> FLASH DEAL
                    </span>
                  )}
                </div>

                {/* Discount percentage tag */}
                {discount > 0 && (
                  <div className="absolute top-5 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-danger to-pink-500 flex items-center justify-center shadow-2xl z-10">
                    <span className="text-white text-xs font-black">-{discount}%</span>
                  </div>
                )}
              </div>

              {/* Thumbnails strip */}
              <div className="flex gap-3 overflow-x-auto py-2 pr-2 scrollbar-thin">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 relative bg-surface-2",
                      i === selectedImage
                        ? "border-primary shadow-[0_0_15px_rgb(99_102_241/0.4)]"
                        : "border-border opacity-60 hover:opacity-100 hover:border-primary/50"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info & Sticky Purchase Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-28">
              
              {/* Product Header */}
              <div>
                {product.brand && (
                  <Link
                    href={`/products?brand=${product.brand}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/20 transition-all mb-3"
                  >
                    <Award className="w-3.5 h-3.5" />
                    {product.brand}
                  </Link>
                )}
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary leading-tight">
                  {product.name}
                </h1>
                {product.shortDescription && (
                  <p className="text-text-secondary text-sm mt-3 leading-relaxed">{product.shortDescription}</p>
                )}
              </div>

              {/* Rating Overview */}
              <div className="flex items-center gap-4 border-b border-border pb-5">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-4 h-4",
                          s <= Math.round(rating)
                            ? "fill-accent text-accent"
                            : "fill-surface-3 text-surface-3"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-text-primary text-sm">{rating}</span>
                  <span className="text-text-muted text-xs font-semibold">({reviewCount.toLocaleString()} reviews)</span>
                </div>
                <span className="text-success text-xs font-bold flex items-center gap-1.5 ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                  {seller.name || "Verified Merchant"}
                </span>
              </div>

              {/* Price Panel */}
              <div className="p-5 rounded-3xl bg-surface-2 border border-border shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-[10px] uppercase font-black tracking-widest">Price</p>
                    <span className="font-display font-black text-3xl text-text-primary">
                      {formatCurrency(price)}
                    </span>
                  </div>
                  {originalPrice > price && (
                    <div className="text-right">
                      <p className="text-text-muted text-xs uppercase font-bold tracking-widest line-through">
                        {formatCurrency(originalPrice)}
                      </p>
                      <p className="text-success text-xs font-black mt-0.5">
                        Save {formatCurrency(originalPrice - price)} ({discount}%)
                      </p>
                    </div>
                  )}
                </div>
                {discount > 0 && (
                  <div className="mt-3.5 p-2 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-2 text-danger text-[11px] font-bold">
                    <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
                    Special Promotion pricing active for this item
                  </div>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", (product.stock || 0) < 10 ? "bg-warning animate-ping" : "bg-success")} />
                <span className={cn("text-xs font-bold", (product.stock || 0) < 10 ? "text-warning" : "text-success")}>
                  {(product.stock || 0) < 10 ? `Only ${product.stock || 0} left in stock — order soon!` : "In stock, ready to ship"}
                </span>
              </div>

              {/* Quantity + Add to Cart Control Panel */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-2xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl hover:bg-surface-3 flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-text-primary text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-9 h-9 rounded-xl hover:bg-surface-3 flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleItem(product)}
                    className={cn(
                      "p-3 rounded-2xl border transition-all duration-300 shadow-md",
                      wishlisted
                        ? "bg-danger border-danger text-white hover:bg-danger/80"
                        : "border-border text-text-muted hover:border-danger/30 hover:text-danger hover:bg-danger/5"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", wishlisted && "fill-current animate-heartbeat")} />
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    className="p-3 rounded-2xl border border-border text-text-muted hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all shadow-md"
                    title="Copy Link"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={cn(
                    "w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 shadow-lg",
                    addedToCart
                      ? "bg-success text-white"
                      : "btn-primary",
                    product.stock === 0 && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </button>

                {/* Buy Now Direct Checkout */}
                <Link
                  href="/checkout"
                  onClick={() => addItem(product, quantity)}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md bg-primary/5"
                >
                  <Zap className="w-4.5 h-4.5 fill-current" />
                  Buy Now — Instant checkout
                </Link>
              </div>

              {/* Delivery check widget */}
              <div className="p-5 rounded-3xl bg-surface-2 border border-border space-y-3 shadow-md">
                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Delivery Estimator</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter delivery pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="input text-xs rounded-xl flex-1 border-border focus:border-primary"
                    id="pincode-input"
                  />
                  <button className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all">
                    Check
                  </button>
                </div>

                {deliveryOptions.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedDelivery(i)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300",
                      selectedDelivery === i
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/20"
                    )}
                  >
                    <opt.icon className={cn("w-4.5 h-4.5 flex-shrink-0", selectedDelivery === i ? "text-primary" : "text-text-muted")} />
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary text-xs">{opt.label}</p>
                      <p className="text-text-muted text-[10px] mt-0.5">{opt.time}</p>
                    </div>
                    <span className={cn("text-xs font-black", opt.price === 0 ? "text-success" : "text-text-primary")}>
                      {opt.price === 0 ? "FREE" : `₹${opt.price}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Guarantees timeline */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Secure Payment" },
                  { icon: RotateCcw, label: returnPolicy },
                  { icon: Award, label: warranty },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface-2 border border-border text-center shadow-sm">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                    <span className="text-[10px] text-text-secondary font-bold leading-tight">{label}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Interactive Specifications / Reviews Tabs Section */}
          <div className="mb-20">
            {/* Custom Tab Navigation */}
            <div className="flex gap-1 bg-surface-2 p-1 rounded-2xl border border-border mb-10 overflow-x-auto">
              {[
                { id: "details" as const, label: "Specifications", icon: Package },
                { id: "reviews" as const, label: `Customer Reviews (${reviewCount.toLocaleString()})`, icon: Star },
                { id: "price" as const, label: "Price Trends", icon: Zap },
                { id: "qna" as const, label: "Q&A Forum", icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Display area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-5 space-y-4">
                      <h3 className="font-display font-black text-xl text-text-primary">About the Product</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{product.description || "No description available for this product."}</p>
                    </div>
                    <div className="md:col-span-7">
                      <h3 className="font-display font-black text-xl text-text-primary mb-4">Specifications</h3>
                      <div className="grid gap-2">
                        {Object.entries(specifications).map(([key, value]) => (
                          <div key={key} className="flex gap-4 py-3 px-4 rounded-xl border border-border bg-surface-2/50 items-center justify-between text-xs">
                            <span className="text-text-muted font-semibold">{key}</span>
                            <span className="text-text-primary font-bold">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-10">
                    <div className="flex flex-col sm:flex-row gap-10 p-6 rounded-3xl bg-surface-2 border border-border items-center">
                      <div className="text-center px-4">
                        <p className="font-display font-black text-6xl gradient-text">{rating}</p>
                        <div className="flex justify-center gap-0.5 mt-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("w-4.5 h-4.5", s <= Math.floor(rating) ? "fill-accent text-accent" : "fill-surface-3 text-surface-3")} />
                          ))}
                        </div>
                        <p className="text-text-muted text-xs font-semibold mt-2">{reviewCount.toLocaleString()} aggregate ratings</p>
                      </div>
                      <div className="flex-1 w-full space-y-2.5">
                        {ratingBreakdown.map(({ stars, count, pct }) => (
                          <div key={stars} className="flex items-center gap-3 text-xs">
                            <span className="text-text-muted font-bold w-6">{stars}★</span>
                            <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-accent to-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-text-muted font-bold w-8 text-right">{pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-lg text-text-primary">
                        {userReviews.length > 0 ? `${userReviews.length} Verified Review${userReviews.length > 1 ? "s" : ""}` : "Customer Reviews"}
                      </h3>
                      {isAuthenticated ? (
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                          Write a Review
                        </button>
                      ) : (
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border text-text-secondary text-xs font-bold hover:border-primary/40 hover:text-primary transition-all"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Login to Review
                        </Link>
                      )}
                    </div>

                    {userReviews.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-5">
                        {userReviews.map((review) => (
                          <div key={review.id} className="p-6 rounded-3xl bg-surface border border-border shadow-card flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-2 ring-1 ring-border">
                                    <img src={review.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`} alt={review.userName} className="w-full h-full" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-text-primary text-xs">{review.userName}</span>
                                      {review.isVerifiedPurchase && (
                                        <span className="badge badge-success text-[7px] py-0.5 px-1.5">✓ VERIFIED</span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-text-muted" suppressHydrationWarning>{new Date(review.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-accent text-accent" : "fill-surface-3 text-surface-3")} />
                                  ))}
                                </div>
                              </div>
                              <h4 className="font-bold text-text-primary text-sm mb-2">{review.title}</h4>
                              <p className="text-text-secondary text-xs leading-relaxed">{review.body}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-text-muted text-xs text-center py-6">No customer reviews yet. Be the first to leave a review!</p>
                    )}
                  </div>
                )}

                {/* Price trends chart */}
                {activeTab === "price" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-black text-xl text-text-primary">Price History (30 Days)</h3>
                      <p className="text-text-muted text-xs mt-1">Track market fluctuations for this item</p>
                    </div>
                    <div className="h-64 bg-surface-2 rounded-3xl border border-border p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                          <YAxis
                            tick={{ fill: "#64748b", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#0f172a",
                              border: "1px solid #334155",
                              borderRadius: "16px",
                              color: "#f8fafc",
                              fontSize: "11px"
                            }}
                            formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Price"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, fill: "#2563eb", stroke: "#fff", strokeWidth: 1.5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Q&A */}
                {activeTab === "qna" && (
                  <div className="space-y-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask a question about item specifications..."
                        className="input rounded-2xl flex-1 text-xs border-border focus:border-primary"
                        id="qna-input"
                      />
                      <button className="px-6 py-2.5 rounded-2xl btn-primary text-xs font-bold uppercase tracking-wider">Ask Merchant</button>
                    </div>
                    <div className="text-center py-16 border border-dashed border-border rounded-3xl">
                      <MessageSquare className="w-10 h-10 mx-auto mb-3 text-text-muted/40" />
                      <p className="text-text-muted text-xs font-bold uppercase tracking-wider">No active Q&A threads</p>
                      <p className="text-text-muted text-xs mt-1.5">Be the first to raise a question to the seller</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Related Products Carousel (Requirement #7) */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-border pt-20">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="section-label inline-flex mb-3">Recommendations</span>
                  <h2 className="heading-lg text-text-primary">Related Products</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, i) => (
                  <ProductCard key={product.id || product.slug} product={product} index={i} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />

      {/* Verified Purchase Review Modal */}
      {product && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          productId={product.id}
          productName={product.name}
          onReviewSubmitted={loadUserReviews}
        />
      )}
    </>
  );
}
