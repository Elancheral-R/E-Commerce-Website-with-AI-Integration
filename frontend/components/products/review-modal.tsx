"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Star, ShieldCheck, AlertCircle, CheckCircle2,
  Package, Send, Hash
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
}

type Step = "verify" | "write" | "done";

export function ReviewModal({ isOpen, onClose, productId, productName, onReviewSubmitted }: ReviewModalProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<Step>("verify");
  const [orderNumber, setOrderNumber] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifiedOrderId, setVerifiedOrderId] = useState("");

  // Review form
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [writeError, setWriteError] = useState("");

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep("verify");
      setOrderNumber("");
      setVerifyError("");
      setVerifiedOrderId("");
      setHoveredStar(0);
      setSelectedStar(0);
      setReviewTitle("");
      setReviewBody("");
      setWriteError("");
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!orderNumber.trim()) {
      setVerifyError("Please enter your Order ID.");
      return;
    }
    setVerifying(true);
    setVerifyError("");

    // Simulate a short delay
    await new Promise((r) => setTimeout(r, 800));

    // Check nexmart-orders in localStorage
    const orders: any[] = JSON.parse(localStorage.getItem("nexmart-orders") || "[]");
    const matchingOrder = orders.find((order) => {
      const orderIdMatch =
        order.id === orderNumber.trim() ||
        order.orderNumber === orderNumber.trim() ||
        String(order.id).toLowerCase() === orderNumber.trim().toLowerCase();
      const userMatch = user ? order.userId === user.id : false;
      const productMatch = order.items?.some((item: any) => item.productId === productId || item.product?.id === productId);
      return orderIdMatch && userMatch && productMatch;
    });

    if (!matchingOrder) {
      // Also check demo/seed orders for testing
      const demoOrders: any[] = JSON.parse(localStorage.getItem("nexmart-orders-demo") || "[]");
      const demoMatch = demoOrders.find((o) =>
        (o.id === orderNumber.trim() || o.orderNumber === orderNumber.trim()) &&
        o.items?.some((item: any) => item.productId === productId || item.product?.id === productId)
      );

      if (!demoMatch) {
        setVerifyError(
          "Purchase not verified. Please make sure you enter the correct Order ID for this product. You can only review items you have purchased."
        );
        setVerifying(false);
        return;
      }
      setVerifiedOrderId(demoMatch.id || orderNumber.trim());
    } else {
      setVerifiedOrderId(matchingOrder.id || orderNumber.trim());
    }

    setVerifying(false);
    setStep("write");
  };

  const handleSubmitReview = async () => {
    if (!selectedStar) {
      setWriteError("Please select a star rating.");
      return;
    }
    if (!reviewTitle.trim()) {
      setWriteError("Please enter a review title.");
      return;
    }
    if (reviewBody.trim().length < 20) {
      setWriteError("Review must be at least 20 characters long.");
      return;
    }

    setSubmitting(true);
    setWriteError("");

    await new Promise((r) => setTimeout(r, 600));

    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      userId: user?.id || "guest",
      userName: user?.name || "Anonymous",
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "user"}`,
      rating: selectedStar,
      title: reviewTitle.trim(),
      body: reviewBody.trim(),
      orderNumber: verifiedOrderId,
      isVerifiedPurchase: true,
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existing: any[] = JSON.parse(localStorage.getItem("nexmart-reviews") || "[]");
    existing.unshift(newReview);
    localStorage.setItem("nexmart-reviews", JSON.stringify(existing));

    setSubmitting(false);
    setStep("done");
    setTimeout(() => {
      onReviewSubmitted();
      onClose();
    }, 2000);
  };

  const starLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-surface border border-border rounded-3xl w-full max-w-lg shadow-2xl pointer-events-auto overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div>
                  <h2 className="font-display font-bold text-lg text-text-primary">Write a Review</h2>
                  <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{productName}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">

                  {/* ─── Step: Verify Purchase ─── */}
                  {step === "verify" && (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex flex-col items-center text-center py-2">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                          <ShieldCheck className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="font-bold text-text-primary text-base">Verify Your Purchase</h3>
                        <p className="text-text-muted text-xs mt-2 max-w-sm leading-relaxed">
                          To maintain review authenticity, only verified buyers can review products. Enter your Order ID to confirm your purchase.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-2 border border-border flex items-start gap-2.5">
                        <Package className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-text-secondary leading-relaxed">
                          Your Order ID can be found in <strong className="text-text-primary">My Orders</strong> page or in the order confirmation email.
                        </p>
                      </div>

                      {verifyError && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-2 p-3 rounded-xl bg-danger/8 border border-danger/15 text-danger text-xs font-medium"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {verifyError}
                        </motion.div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">Order ID / Purchase Number *</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Hash className="w-4 h-4 text-text-muted flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="e.g. ORD-1234567890"
                            value={orderNumber}
                            onChange={(e) => { setOrderNumber(e.target.value); setVerifyError(""); }}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleVerify}
                        disabled={verifying}
                        className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {verifying ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying…
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Verify Purchase
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* ─── Step: Write Review ─── */}
                  {step === "write" && (
                    <motion.div
                      key="write"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-success/8 border border-success/15">
                        <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
                        <p className="text-xs text-success font-semibold">Purchase verified! You can now write your review.</p>
                      </div>

                      {writeError && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 rounded-xl bg-danger/8 border border-danger/15 text-danger text-xs font-medium"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {writeError}
                        </motion.div>
                      )}

                      {/* Star Rating */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Your Rating *</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onMouseEnter={() => setHoveredStar(s)}
                              onMouseLeave={() => setHoveredStar(0)}
                              onClick={() => setSelectedStar(s)}
                              className="transition-transform hover:scale-110 active:scale-95"
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  s <= (hoveredStar || selectedStar)
                                    ? "fill-accent text-accent"
                                    : "fill-surface-3 text-surface-3"
                                }`}
                              />
                            </button>
                          ))}
                          {(hoveredStar || selectedStar) > 0 && (
                            <span className="ml-3 text-sm font-bold text-text-secondary">
                              {starLabels[hoveredStar || selectedStar]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">Review Title *</label>
                        <input
                          type="text"
                          placeholder="Summarize your experience in a few words"
                          value={reviewTitle}
                          onChange={(e) => { setReviewTitle(e.target.value); setWriteError(""); }}
                          maxLength={100}
                          className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus:border-primary transition-all text-sm text-text-primary outline-none"
                        />
                      </div>

                      {/* Body */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">Your Review * (min 20 chars)</label>
                        <textarea
                          placeholder="Share your honest thoughts about the product quality, features, and overall experience…"
                          value={reviewBody}
                          onChange={(e) => { setReviewBody(e.target.value); setWriteError(""); }}
                          rows={4}
                          maxLength={1000}
                          className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus:border-primary transition-all text-sm text-text-primary outline-none resize-none"
                        />
                        <p className="text-[10px] text-text-muted text-right">{reviewBody.length}/1000</p>
                      </div>

                      <button
                        onClick={handleSubmitReview}
                        disabled={submitting}
                        className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Review
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* ─── Step: Done ─── */}
                  {step === "done" && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center text-center py-6 space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-success" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-lg">Review Published!</h3>
                        <p className="text-text-muted text-sm mt-1">
                          Thank you for your verified review. It helps other shoppers make better decisions.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
