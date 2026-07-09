"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, total, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const freeShippingThreshold = 999;
  const currentSubtotal = subtotal();
  const shipping = currentSubtotal > freeShippingThreshold ? 0 : 99;
  const progressPercent = Math.min(100, (currentSubtotal / freeShippingThreshold) * 100);
  const neededForFreeShipping = freeShippingThreshold - currentSubtotal;

  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === "NEXMART50") {
      applyCoupon(couponInput.toUpperCase(), Math.floor(currentSubtotal * 0.1));
      setCouponError("");
    } else if (couponInput.toUpperCase() === "FREESHIP") {
      applyCoupon(couponInput.toUpperCase(), 99);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try NEXMART50");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-dark border-l border-white/8 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl text-white">
                  Cart
                </h2>
                {items.length > 0 && (
                  <span className="badge badge-primary text-[10px]">
                    {items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Progress Bar */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  {neededForFreeShipping > 0 ? (
                    <p className="text-white/60 font-semibold">
                      Add <span className="text-primary font-black">{formatCurrency(neededForFreeShipping)}</span> for free shipping
                    </p>
                  ) : (
                    <p className="text-success font-black flex items-center gap-1">
                      🎉 Free shipping unlocked!
                    </p>
                  )}
                  <span className="text-[10px] text-white/40 font-bold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6 }}
                    className={cn(
                      "h-full rounded-full",
                      progressPercent === 100
                        ? "bg-gradient-to-r from-success to-emerald-400"
                        : "bg-gradient-to-r from-primary to-secondary"
                    )}
                  />
                </div>
              </div>
            )}

            {/* Items scroll list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/3 flex items-center justify-center border border-white/5">
                    <ShoppingCart className="w-10 h-10 text-white/30" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">Your cart is empty</p>
                    <p className="text-white/40 text-xs mt-1">Browse products and build your next-gen setup.</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-primary mt-2"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="flex gap-4 p-4 rounded-2xl bg-surface-2 border border-white/5 group shadow-sm hover:border-white/10 transition-all duration-200"
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-3 border border-white/5"
                      onClick={closeCart}
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
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-bold text-white text-xs line-clamp-1 hover:text-primary transition-colors block leading-tight"
                          onClick={closeCart}
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-wider mt-1">{item.product.brand}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity picker */}
                        <div className="flex items-center gap-2 bg-surface-3/80 border border-white/5 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price + Delete */}
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-xs">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-danger hover:bg-danger/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary panel */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4 bg-white/[0.01]">
                {/* Coupon apply widget */}
                <div className="space-y-2">
                  {couponCode ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-success/8 border border-success/15 shadow-sm">
                      <div className="flex items-center gap-2 text-success">
                        <Tag className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">{couponCode}</span>
                        <span className="text-xs font-medium">-{formatCurrency(couponDiscount)}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-white/40 hover:text-danger text-[10px] font-black uppercase tracking-wider">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (NEXMART50)"
                        className="input text-xs rounded-xl flex-1 border-white/8 focus:border-primary"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                        id="coupon-input"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all uppercase tracking-wider"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-[10px] text-danger font-bold mt-1">{couponError}</p>}
                </div>

                {/* Subtotals breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>{formatCurrency(currentSubtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-success font-semibold">
                      <span>Promo Discount</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/50">
                    <span>Shipping fee</span>
                    <span>{shipping === 0 ? <span className="text-success font-bold">FREE</span> : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-display font-black text-white text-base pt-3.5 border-t border-white/5">
                    <span>Order Total</span>
                    <span className="gradient-text">{formatCurrency(total())}</span>
                  </div>
                </div>

                {/* Direct payment CTA */}
                <Link
                  href="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black uppercase tracking-wider glow-primary"
                  onClick={closeCart}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  className="block text-center text-xs text-white/40 hover:text-white transition-colors py-1.5 font-bold uppercase tracking-wider"
                  onClick={closeCart}
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
