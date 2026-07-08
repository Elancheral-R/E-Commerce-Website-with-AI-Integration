"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, total, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore();
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-dark border-l border-white/5 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl text-text-primary">
                  Shopping Cart
                </h2>
                {items.length > 0 && (
                  <span className="badge badge-primary">
                    {items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-surface-2 text-text-muted hover:text-text-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-24 h-24 rounded-full bg-surface-2 flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-text-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-lg">Your cart is empty</p>
                    <p className="text-text-muted text-sm mt-1">Add items to start shopping!</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 rounded-2xl bg-surface-2 border border-border group"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-3"
                      onClick={closeCart}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-text-primary text-sm line-clamp-2 hover:text-primary transition-colors"
                        onClick={closeCart}
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-text-muted mt-0.5">{item.product.brand}</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-surface-3 hover:bg-primary/20 flex items-center justify-center transition-all text-text-secondary hover:text-primary"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-surface-3 hover:bg-primary/20 flex items-center justify-center transition-all text-text-secondary hover:text-primary"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price + Delete */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary text-sm">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all"
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

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                {/* Coupon */}
                <div className="space-y-2">
                  {couponCode ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/20">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-success" />
                        <span className="text-sm text-success font-medium">{couponCode} applied!</span>
                        <span className="text-sm text-success">-{formatCurrency(couponDiscount)}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-text-muted hover:text-danger text-xs">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (try NEXMART50)"
                        className="input flex-1 text-xs rounded-xl"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                        id="coupon-input"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 rounded-xl bg-primary/20 text-primary font-medium text-sm hover:bg-primary hover:text-white transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-danger">{couponError}</p>}
                </div>

                {/* Summary */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal())}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Coupon Discount</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-success">FREE</span> : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-text-primary text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="gradient-text">{formatCurrency(total())}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-semibold"
                  onClick={closeCart}
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/cart"
                  className="block text-center text-sm text-text-muted hover:text-primary transition-colors py-1"
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
