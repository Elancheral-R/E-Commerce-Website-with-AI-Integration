"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Check,
  ChevronLeft, ChevronRight, Share2, Zap, Package, Award, Plus, Minus, MessageSquare, ShieldCheck, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCard } from "@/components/products/product-card";
import { mockProducts, mockReviews } from "@/lib/mock-data";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { formatCurrency, getDiscountPercentage, cn } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Mock price history
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
  params: { slug: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = mockProducts.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "qna" | "price">("details");
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [pincode, setPincode] = useState("");

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const discount = getDiscountPercentage(product.originalPrice, product.price);

  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id && p.category.id === product.category.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    openCart();
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const avgRating = mockReviews.reduce((s, r) => s + r.rating, 0) / (mockReviews.length || 1);
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: mockReviews.filter((r) => r.rating === stars).length,
    pct: Math.round((mockReviews.filter((r) => r.rating === stars).length / (mockReviews.length || 1)) * 100),
  }));

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-[#06060a] pt-32 pb-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.06] pointer-events-none bg-gradient-to-br from-primary to-secondary" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.04] pointer-events-none bg-gradient-to-br from-electric to-cyan-400" />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-text-muted mb-8 tracking-wider uppercase font-semibold">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <span className="text-white/20">/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Product Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
            {/* Left: Interactive Media Gallery (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-square rounded-3xl overflow-hidden glass border border-white/8 bg-surface-2 shadow-2xl flex items-center justify-center group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </AnimatePresence>

                {/* Subtle Image Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* Image Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full frosted border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-xl"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full frosted border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-xl"
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

              {/* Thumbnails strip with Apple-inspired floating frame */}
              <div className="flex gap-3 overflow-x-auto py-2 pr-2 scrollbar-thin">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 relative bg-surface-2",
                      i === selectedImage
                        ? "border-primary shadow-[0_0_15px_rgb(99_102_241/0.4)]"
                        : "border-white/5 opacity-60 hover:opacity-100 hover:border-white/20"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Immersive Info & Sticky Purchase Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-7 lg:sticky lg:top-28">
              {/* Product Header */}
              <div>
                <Link
                  href={`/products?brand=${product.brand}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  {product.brand}
                </Link>
                <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3.5 leading-tight">
                  {product.name}
                </h1>
                <p className="text-white/50 text-sm mt-3.5 leading-relaxed">{product.shortDescription}</p>
              </div>

              {/* Rating Overview */}
              <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-4 h-4",
                          s <= Math.round(product.rating)
                            ? "fill-accent text-accent"
                            : "fill-white/10 text-white/10"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white text-sm">{product.rating}</span>
                  <span className="text-white/40 text-xs font-semibold">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <span className="text-success text-xs font-bold flex items-center gap-1.5 ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                  Verified Merchant
                </span>
              </div>

              {/* Price Panel */}
              <div className="p-5 rounded-3xl bg-surface-2 border border-white/8 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Price</p>
                    <span className="font-display font-black text-3xl text-white">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-right">
                      <p className="text-white/30 text-xs uppercase font-bold tracking-widest line-through">
                        {formatCurrency(product.originalPrice)}
                      </p>
                      <p className="text-success text-xs font-black mt-0.5">
                        Save {formatCurrency(product.originalPrice - product.price)} ({discount}%)
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
                <div className={cn("w-2 h-2 rounded-full", product.stock < 10 ? "bg-warning animate-ping" : "bg-success")} />
                <span className={cn("text-xs font-bold", product.stock < 10 ? "text-warning" : "text-success")}>
                  {product.stock < 10 ? `Only ${product.stock} left in stock — order soon!` : "In stock, ready to ship"}
                </span>
              </div>

              {/* Quantity + Add to Cart Control Panel */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3 bg-surface-2 border border-white/8 rounded-2xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-white text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-9 h-9 rounded-xl hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all"
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
                        : "border-white/8 text-white/50 hover:border-danger/30 hover:text-danger hover:bg-danger/5"
                    )}
                  >
                    <Heart className={cn("w-5 h-5", wishlisted && "fill-current animate-heartbeat")} />
                  </button>

                  {/* Share */}
                  <button
                    className="p-3 rounded-2xl border border-white/8 text-white/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all shadow-md"
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
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 hover:border-white shadow-md bg-white/5"
                >
                  <Zap className="w-4.5 h-4.5 fill-current" />
                  Buy Now — Instant checkout
                </Link>
              </div>

              {/* Delivery check widget */}
              <div className="p-5 rounded-3xl bg-surface-2 border border-white/8 space-y-3 shadow-md">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Delivery Estimator</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter delivery pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="input text-xs rounded-xl flex-1 border-white/8 focus:border-primary"
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
                        : "border-white/5 hover:border-primary/20"
                    )}
                  >
                    <opt.icon className={cn("w-4.5 h-4.5 flex-shrink-0", selectedDelivery === i ? "text-primary" : "text-white/40")} />
                    <div className="flex-1">
                      <p className="font-semibold text-white text-xs">{opt.label}</p>
                      <p className="text-white/45 text-[10px] mt-0.5">{opt.time}</p>
                    </div>
                    <span className={cn("text-xs font-black", opt.price === 0 ? "text-success" : "text-white")}>
                      {opt.price === 0 ? "FREE" : `₹${opt.price}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Guarantees timeline */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Secure Payment" },
                  { icon: RotateCcw, label: `${product.returnPolicy}` },
                  { icon: Award, label: product.warranty ?? "Warranty" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-surface-2 border border-white/5 text-center shadow-sm">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                    <span className="text-[10px] text-white/50 font-bold leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Merchant card */}
              <div className="flex items-center justify-between p-4 rounded-3xl bg-surface-2 border border-white/5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">🏪</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{product.seller.name}</span>
                      {product.seller.verified && (
                        <span className="badge badge-success text-[8px] py-0 px-1">✓ Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-white/40 mt-0.5">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="font-bold text-white/60">{product.seller.rating}</span> · {product.seller.totalSales.toLocaleString()} sales
                    </div>
                  </div>
                </div>
                <Link href={`/sellers/${product.seller.id}`} className="text-primary text-xs font-bold hover:underline">
                  Visit Store
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Specifications / Reviews Tabs Section */}
          <div className="mb-20">
            {/* Custom Tab Panel Navigation */}
            <div className="flex gap-1 bg-surface-2 p-1 rounded-2xl border border-white/5 mb-10 overflow-x-auto">
              {[
                { id: "details" as const, label: "Specifications", icon: Package },
                { id: "reviews" as const, label: `Customer Reviews (${product.reviewCount.toLocaleString()})`, icon: Star },
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
                      : "text-white/40 hover:text-white"
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
                      <h3 className="font-display font-black text-xl text-white">About the Product</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>
                    </div>
                    <div className="md:col-span-7">
                      <h3 className="font-display font-black text-xl text-white mb-4">Specifications</h3>
                      <div className="grid gap-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex gap-4 py-3 px-4 rounded-xl border border-white/5 bg-surface-2/30 items-center justify-between text-xs">
                            <span className="text-white/45 font-semibold">{key}</span>
                            <span className="text-white font-bold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-10">
                    {/* Rating statistics */}
                    <div className="flex flex-col sm:flex-row gap-10 p-6 rounded-3xl bg-surface-2 border border-white/5 items-center">
                      <div className="text-center px-4">
                        <p className="font-display font-black text-6xl gradient-text">{product.rating}</p>
                        <div className="flex justify-center gap-0.5 mt-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("w-4.5 h-4.5", s <= Math.floor(product.rating) ? "fill-accent text-accent" : "fill-white/10 text-white/10")} />
                          ))}
                        </div>
                        <p className="text-white/40 text-xs font-semibold mt-2">{product.reviewCount.toLocaleString()} aggregate ratings</p>
                      </div>
                      <div className="flex-1 w-full space-y-2.5">
                        {ratingBreakdown.map(({ stars, count, pct }) => (
                          <div key={stars} className="flex items-center gap-3 text-xs">
                            <span className="text-white/40 font-bold w-6">{stars}★</span>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-accent to-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-white/40 font-bold w-8 text-right">{pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review List cards */}
                    <div className="grid md:grid-cols-2 gap-5">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="p-6 rounded-3xl bg-surface border border-white/5 shadow-md flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-2 ring-1 ring-white/10">
                                  <img src={review.user.avatar} alt={review.user.name} className="w-full h-full" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white text-xs">{review.user.name}</span>
                                    {review.isVerifiedPurchase && (
                                      <span className="badge badge-success text-[7px] py-0.5 px-1.5">✓ VERIFIED</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-white/30">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-accent text-accent" : "fill-white/15 text-white/15")} />
                                ))}
                              </div>
                            </div>
                            <h4 className="font-bold text-white text-sm mb-2">{review.title}</h4>
                            <p className="text-white/50 text-xs leading-relaxed">{review.body}</p>
                          </div>

                          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5 text-[10px] text-white/30">
                            <button className="hover:text-primary transition-colors font-bold uppercase">
                              👍 Helpful ({review.helpfulCount})
                            </button>
                            <button className="hover:text-primary transition-colors font-bold uppercase">Report Abuse</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price trends chart */}
                {activeTab === "price" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-black text-xl text-white">Price History (30 Days)</h3>
                      <p className="text-white/40 text-xs mt-1">Track market fluctuations & trigger alerts at your sweet spot</p>
                    </div>
                    <div className="h-64 bg-surface-2 rounded-3xl border border-white/8 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="date" tick={{ fill: "#55557a", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                          <YAxis
                            tick={{ fill: "#55557a", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#0e0e16",
                              border: "1px solid #1e1e30",
                              borderRadius: "16px",
                              color: "#f0f0ff",
                              fontSize: "11px"
                            }}
                            formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Price"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#6366f1"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 1.5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "30-Day Low", value: formatCurrency(Math.min(...priceHistory.map((d) => d.price))), color: "text-success" },
                        { label: "Current Price", value: formatCurrency(product.price), color: "text-primary" },
                        { label: "30-Day High", value: formatCurrency(Math.max(...priceHistory.map((d) => d.price))), color: "text-danger" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="p-4 rounded-2xl bg-surface-2 border border-white/5 text-center shadow-md">
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">{label}</p>
                          <p className={`font-display font-bold text-base mt-1.5 ${color}`}>{value}</p>
                        </div>
                      ))}
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
                        className="input rounded-2xl flex-1 text-xs border-white/8 focus:border-primary"
                        id="qna-input"
                      />
                      <button className="px-6 py-2.5 rounded-2xl btn-primary text-xs font-bold uppercase tracking-wider">Ask AI Forum</button>
                    </div>
                    <div className="text-center py-16 border border-dashed border-white/8 rounded-3xl">
                      <MessageSquare className="w-10 h-10 mx-auto mb-3 text-white/20" />
                      <p className="text-white/40 text-xs font-bold uppercase tracking-wider">No active threads</p>
                      <p className="text-white/30 text-xs mt-1.5">Be the first to raise a question and get instant response from our merchants</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-white/5 pt-20">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <span className="section-label inline-flex mb-3">Recommends</span>
                  <h2 className="heading-lg text-white">You May Also Like</h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
