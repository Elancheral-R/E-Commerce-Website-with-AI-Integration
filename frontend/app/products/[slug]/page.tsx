"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, Check,
  ChevronLeft, ChevronRight, Share2, Zap, Package, Award, Plus, Minus, MessageSquare
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
    price: Math.floor(Math.random() * 30000 + 170000),
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
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Product Main */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Left: Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-2 border border-border">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Navigation arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <span className="badge badge-primary">NEW</span>}
                  {product.isBestSeller && <span className="badge badge-warning">BESTSELLER</span>}
                  {product.isFlashSale && (
                    <span className="badge badge-danger animate-pulse">
                      <Zap className="w-3 h-3" /> FLASH SALE
                    </span>
                  )}
                </div>

                {/* Discount */}
                {discount > 0 && (
                  <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-danger flex items-center justify-center">
                    <span className="text-white text-xs font-bold text-center leading-tight">
                      -{discount}%
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                      i === selectedImage ? "border-primary" : "border-border hover:border-primary/50"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Brand & Name */}
              <div>
                <Link
                  href={`/products?brand=${product.brand}`}
                  className="text-primary font-bold text-sm uppercase tracking-widest hover:underline"
                >
                  {product.brand}
                </Link>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary mt-2 leading-snug">
                  {product.name}
                </h1>
                <p className="text-text-muted text-sm mt-2">{product.shortDescription}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-5 h-5",
                          s <= Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "fill-border text-border"
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-text-primary">{product.rating}</span>
                  <span className="text-text-muted text-sm">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <span className="text-success text-sm font-medium">
                  ✓ Verified Product
                </span>
              </div>

              {/* Price */}
              <div className="p-4 rounded-2xl bg-surface-2 border border-border">
                <div className="flex items-center gap-4">
                  <span className="font-display font-bold text-4xl gradient-text">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <div>
                      <p className="text-text-muted line-through text-lg">
                        {formatCurrency(product.originalPrice)}
                      </p>
                      <p className="text-success font-bold">You save {formatCurrency(product.originalPrice - product.price)}</p>
                    </div>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-danger text-sm font-medium mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {discount}% off — Limited time offer!
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <Check className="w-4 h-4 text-success" />
                    <span className={cn("text-sm font-medium", product.stock < 10 ? "text-warning" : "text-success")}>
                      {product.stock < 10 ? `Only ${product.stock} left in stock!` : "In Stock"}
                    </span>
                  </>
                ) : (
                  <span className="text-danger text-sm font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity + Add to Cart */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg hover:bg-surface-3 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-text-primary">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg hover:bg-surface-3 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleItem(product)}
                    className={cn(
                      "p-3 rounded-xl border transition-all",
                      wishlisted
                        ? "bg-danger border-danger text-white"
                        : "border-border text-text-muted hover:border-danger hover:text-danger"
                    )}
                    title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={cn("w-5 h-5", wishlisted && "fill-current")} />
                  </button>

                  {/* Share */}
                  <button
                    className="p-3 rounded-xl border border-border text-text-muted hover:border-primary hover:text-primary transition-all"
                    title="Share product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all",
                    addedToCart
                      ? "bg-success text-white"
                      : "btn-primary",
                    product.stock === 0 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {addedToCart ? "Added to Cart!" : "Add to Cart"}
                </button>

                <button className="w-full py-4 rounded-2xl font-bold text-base border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3">
                  <Zap className="w-5 h-5" />
                  Buy Now — Instant Checkout
                </button>
              </div>

              {/* Delivery Options */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter pincode for delivery info"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="input flex-1 text-sm rounded-xl"
                    id="pincode-input"
                  />
                  <button className="px-4 py-2 rounded-xl bg-primary/20 text-primary font-medium text-sm hover:bg-primary hover:text-white transition-all">
                    Check
                  </button>
                </div>

                {deliveryOptions.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedDelivery(i)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      selectedDelivery === i
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <opt.icon className={cn("w-5 h-5 flex-shrink-0", selectedDelivery === i ? "text-primary" : "text-text-muted")} />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary text-sm">{opt.label}</p>
                      <p className="text-text-muted text-xs">{opt.time}</p>
                    </div>
                    <span className={cn("text-sm font-semibold", opt.price === 0 ? "text-success" : "text-text-primary")}>
                      {opt.price === 0 ? "FREE" : `₹${opt.price}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Shield, label: "Secure Payment" },
                  { icon: RotateCcw, label: `${product.returnPolicy}` },
                  { icon: Award, label: product.warranty ?? "Warranty" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-2 border border-border text-center">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-text-muted leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Seller */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-2 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">🏪</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-sm">{product.seller.name}</span>
                      {product.seller.verified && (
                        <span className="badge badge-success text-[10px]">✓ Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      {product.seller.rating} · {product.seller.totalSales.toLocaleString()} sales
                    </div>
                  </div>
                </div>
                <Link href={`/sellers/${product.seller.id}`} className="text-primary text-sm font-medium hover:underline">
                  View Store
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mb-16">
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-surface-2 p-1 rounded-2xl border border-border mb-8 overflow-x-auto">
              {[
                { id: "details" as const, label: "Product Details", icon: Package },
                { id: "reviews" as const, label: `Reviews (${product.reviewCount.toLocaleString()})`, icon: Star },
                { id: "price" as const, label: "Price History", icon: Zap },
                { id: "qna" as const, label: "Q&A", icon: MessageSquare },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-lg"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-display font-bold text-xl text-text-primary mb-4">Description</h3>
                      <p className="text-text-secondary leading-relaxed">{product.description}</p>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-text-primary mb-4">Specifications</h3>
                      <div className="space-y-3">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex gap-4 py-2 border-b border-border last:border-0">
                            <span className="text-text-muted text-sm w-32 flex-shrink-0">{key}</span>
                            <span className="text-text-primary text-sm font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-8">
                    {/* Rating Overview */}
                    <div className="flex flex-col sm:flex-row gap-8 p-6 rounded-2xl bg-surface-2 border border-border">
                      <div className="text-center">
                        <p className="font-display font-bold text-6xl gradient-text">{product.rating}</p>
                        <div className="flex justify-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("w-5 h-5", s <= Math.floor(product.rating) ? "fill-accent text-accent" : "fill-border text-border")} />
                          ))}
                        </div>
                        <p className="text-text-muted text-sm mt-1">{product.reviewCount.toLocaleString()} reviews</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {ratingBreakdown.map(({ stars, count, pct }) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-text-muted text-sm w-6">{stars}★</span>
                            <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-text-muted text-sm w-8">{pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="p-6 rounded-2xl bg-surface border border-border">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-2">
                                <img src={review.user.avatar} alt={review.user.name} className="w-full h-full" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-text-primary text-sm">{review.user.name}</span>
                                  {review.isVerifiedPurchase && (
                                    <span className="badge badge-success text-[10px]">✓ Verified Purchase</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "fill-accent text-accent" : "fill-border text-border")} />
                                    ))}
                                  </div>
                                  <span className="text-text-muted text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <h4 className="font-semibold text-text-primary mb-2">{review.title}</h4>
                          <p className="text-text-secondary text-sm leading-relaxed">{review.body}</p>
                          <div className="flex items-center gap-4 mt-4 text-text-muted text-xs">
                            <button className="hover:text-primary transition-colors">
                              👍 Helpful ({review.helpfulCount})
                            </button>
                            <button className="hover:text-primary transition-colors">Report</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price History Tab */}
                {activeTab === "price" && (
                  <div>
                    <h3 className="font-display font-bold text-xl text-text-primary mb-2">Price History (30 Days)</h3>
                    <p className="text-text-muted text-sm mb-6">Track price changes and find the best time to buy</p>
                    <div className="h-64 bg-surface-2 rounded-2xl border border-border p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
                          <YAxis
                            tick={{ fill: "#64748b", fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#111118",
                              border: "1px solid #1f1f2e",
                              borderRadius: "12px",
                              color: "#f8fafc",
                            }}
                            formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Price"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#6366f1" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-4">
                      {[
                        { label: "Lowest (30d)", value: formatCurrency(Math.min(...priceHistory.map((d) => d.price))), color: "text-success" },
                        { label: "Current", value: formatCurrency(product.price), color: "text-primary" },
                        { label: "Highest (30d)", value: formatCurrency(Math.max(...priceHistory.map((d) => d.price))), color: "text-danger" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex-1 p-3 rounded-xl bg-surface-2 border border-border text-center">
                          <p className="text-text-muted text-xs">{label}</p>
                          <p className={`font-bold text-base mt-1 ${color}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Q&A Tab */}
                {activeTab === "qna" && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Ask a question about this product..."
                        className="input flex-1 rounded-xl"
                        id="qna-input"
                      />
                      <button className="px-6 py-2.5 rounded-xl btn-primary text-sm">Ask</button>
                    </div>
                    <div className="text-center py-12 text-text-muted">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No questions yet. Be the first to ask!</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-2xl text-text-primary mb-6">
                You May Also Like
              </h2>
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
