"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function OrderConfirmationPage() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate a simulated unique order number
    const rand = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(`NEX-${rand}`);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16 flex flex-col justify-center">
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto glass-card rounded-3xl border border-border p-8 md:p-12 text-center space-y-8 bg-surface">
            
            {/* Animated Check Mark */}
            <div className="relative w-24 h-24 mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-full h-full rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success"
              >
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </motion.div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center text-primary animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Headers */}
            <div className="space-y-3">
              <span className="badge badge-success">Payment Successful</span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
                Order Placed Successfully!
              </h1>
              <p className="text-text-secondary text-sm max-w-md mx-auto">
                Thank you for shopping with us. We have received your order and are preparing it for shipment.
              </p>
            </div>

            {/* Order Details Panel */}
            <div className="bg-surface-2 border border-border rounded-2xl p-6 grid sm:grid-cols-2 gap-6 text-left">
              <div className="space-y-1">
                <span className="text-xs font-bold text-text-muted uppercase">Order Number</span>
                <p className="font-mono font-bold text-text-primary text-base">{orderNumber}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-text-muted uppercase">Estimated Delivery</span>
                <p className="font-semibold text-text-primary text-base flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  Friday, July 10, 2026
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2 border-t border-border pt-4">
                <span className="text-xs font-bold text-text-muted uppercase">Delivery Address</span>
                <p className="text-text-secondary text-sm mt-1 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>123 Technology Park, Outer Ring Road, Bangalore, Karnataka, 560103</span>
                </p>
              </div>
            </div>

            {/* Notification Alert */}
            <div className="text-xs text-text-muted flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>A confirmation email & SMS has been sent to your registered address.</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/orders" className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5">
                Track Your Order
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products"
                className="px-8 py-3.5 rounded-full border border-border text-text-secondary hover:text-text-primary font-semibold transition-all hover:bg-surface-2"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
