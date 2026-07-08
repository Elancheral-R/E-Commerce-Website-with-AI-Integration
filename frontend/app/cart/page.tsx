"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Shield,
  RotateCcw, Truck, Lock, ArrowLeft
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    total,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const shipping = subtotal() > 999 ? 0 : 99;

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === "NEXMART50") {
      applyCoupon(couponInput, Math.floor(subtotal() * 0.1));
      setCouponError("");
    } else if (couponInput.toUpperCase() === "FREESHIP") {
      applyCoupon(couponInput, 99);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try NEXMART50");
    }
  };

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h1 className="font-display font-bold text-3xl text-text-primary mb-8 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Shopping Cart
          </h1>

          {items.length === 0 ? (
            <div className="glass-card rounded-3xl border border-border p-12 text-center max-w-xl mx-auto space-y-6">
              <div className="w-24 h-24 rounded-full bg-surface-2 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-12 h-12 text-text-muted" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl text-text-primary">Your cart is empty</h2>
                <p className="text-text-muted mt-2">
                  Looks like you haven&apos;t added anything to your cart yet. Let&apos;s find some amazing products!
                </p>
              </div>
              <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5">
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              {/* Items List */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="glass-card rounded-2xl border border-border p-6 flex flex-col sm:flex-row gap-6 relative group"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="w-28 h-28 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-display font-bold text-text-primary text-base hover:text-primary transition-colors line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-all flex-shrink-0"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-text-muted mt-1">{item.product.brand}</p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg hover:bg-surface-3 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-semibold text-text-primary text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg hover:bg-surface-3 flex items-center justify-center text-text-secondary hover:text-text-primary transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Pricing */}
                          <div className="text-right">
                            <span className="font-display font-bold text-lg text-primary">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <p className="text-xs text-text-muted mt-0.5">
                                {formatCurrency(item.product.price)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Back button */}
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>

              {/* Order Summary Sidebar */}
              <div className="space-y-6">
                <div className="glass-card rounded-3xl border border-border p-6 space-y-6">
                  <h2 className="font-display font-bold text-xl text-text-primary border-b border-border pb-4">
                    Order Summary
                  </h2>

                  {/* Coupon Code */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                      Promo Code
                    </label>
                    {couponCode ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-success/15 border border-success/30">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-success" />
                          <span className="text-sm font-medium text-success">{couponCode} applied</span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-xs font-bold text-text-muted hover:text-danger"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code (NEXMART50)"
                          value={couponInput}
                          onChange={(e) => {
                            setCouponInput(e.target.value);
                            setCouponError("");
                          }}
                          className="input flex-1 text-xs rounded-xl"
                          id="cart-coupon-input"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="px-4 py-2.5 rounded-xl bg-primary/20 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {couponError && <p className="text-xs text-danger">{couponError}</p>}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Subtotal</span>
                      <span className="font-semibold text-text-primary">
                        {formatCurrency(subtotal())}
                      </span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-sm text-success">
                        <span>Coupon Discount</span>
                        <span className="font-semibold">
                          -{formatCurrency(couponDiscount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Estimated Shipping</span>
                      <span className="font-semibold text-text-primary">
                        {shipping === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          formatCurrency(shipping)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Estimated Tax (GST 18%)</span>
                      <span className="font-semibold text-text-primary">
                        {formatCurrency(Math.floor(subtotal() * 0.18))}
                      </span>
                    </div>

                    <div className="flex justify-between font-display font-bold text-lg text-text-primary pt-4 border-t border-border">
                      <span>Total Amount</span>
                      <span className="gradient-text">{formatCurrency(total() + Math.floor(subtotal() * 0.18))}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Additional Trust Indicators */}
                <div className="glass-card rounded-2xl border border-border p-4 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Secure Checkout with SSL 256-bit encryption.</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <RotateCcw className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Hassle-free 30 days return and exchange policy.</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-secondary">
                    <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Free express shipping on all orders over ₹999.</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
