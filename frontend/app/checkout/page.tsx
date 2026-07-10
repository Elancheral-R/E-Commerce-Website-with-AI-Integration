"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, CreditCard, Truck, MapPin, CheckCircle, ArrowRight,
  ChevronRight, Lock, Gift, AlertCircle, Sparkles
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";

const STEPS = [
  { id: "address", label: "Shipping Address", icon: MapPin },
  { id: "shipping", label: "Shipping Method", icon: Truck },
  { id: "payment", label: "Payment Details", icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);

  // Address State
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Shipping Method State
  const [shippingMethod, setShippingMethod] = useState("express");

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [giftWrapping, setGiftWrapping] = useState(false);

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      clearCart();
      router.push("/orders/confirmation");
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const shippingCost = shippingMethod === "same_day" ? 299 : shippingMethod === "express" ? 149 : 0;
  const gstCost = Math.floor(subtotal() * 0.18);
  const totalAmount = total() + gstCost + shippingCost + (giftWrapping ? 49 : 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#06060a] pt-32 pb-24 relative overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.05] pointer-events-none bg-gradient-to-br from-primary to-secondary" />
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left/Middle Column: Steps & Forms */}
            <div className="lg:col-span-8 space-y-6">

              {/* ─── Auth Gate ─────────────────────────────────────────── */}
              {!isAuthenticated ? (
                <div className="glass-card rounded-3xl border border-white/10 p-8 bg-surface shadow-2xl text-center flex flex-col items-center justify-center py-16 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-2xl text-white mb-2">Sign In Required</h2>
                    <p className="text-white/60 text-sm max-w-sm mx-auto">
                      You must be signed in to check out and place your order. Sign in now to retrieve your saved addresses and secure your checkout.
                    </p>
                  </div>
                  <Link
                    href="/auth/login?redirectTo=/checkout"
                    className="btn-primary px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2"
                    id="checkout-login-btn"
                  >
                    Sign In to Place Order
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-white/30 text-xs">
                    New here?{" "}
                    <Link href="/auth/register" className="text-primary hover:underline">
                      Create an account
                    </Link>
                  </p>
                </div>
              ) : (
                <>
                  {/* Stepper progress indicator */}
                  <div className="glass-card rounded-3xl border border-white/5 p-6 bg-surface-2 flex items-center justify-between shadow-xl">
                    {STEPS.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.id} className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 shadow-md ${
                              index <= activeStep
                                ? "bg-gradient-to-r from-primary to-secondary text-white glow-primary"
                                : "bg-surface-3 text-white/30 border border-white/5"
                            }`}
                          >
                            {index < activeStep ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <div className="hidden md:block text-left">
                            <p className="text-[10px] text-white/35 font-bold uppercase tracking-wider">Step {index + 1}</p>
                            <p className={`text-xs font-black tracking-wide ${index === activeStep ? "text-white" : "text-white/45"}`}>
                              {step.label}
                            </p>
                          </div>
                          {index < STEPS.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-white/20 ml-4 hidden md:block" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step Forms Container */}
                  <div className="glass-card rounded-3xl border border-white/8 p-8 bg-surface space-y-6 shadow-2xl">

                    {/* Step 1: Address */}
                    {activeStep === 0 && (
                      <div className="space-y-6">
                        <div>
                          <span className="section-label mb-3 inline-flex">Delivery</span>
                          <h2 className="font-display font-black text-2xl text-white flex items-center gap-2">
                            Shipping Address
                          </h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Full Name *</label>
                            <input type="text" required placeholder="John Doe" value={address.fullName}
                              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="fullName" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Phone Number *</label>
                            <input type="tel" required placeholder="9876543210" value={address.phone}
                              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="phone" />
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Address Line 1 *</label>
                            <input type="text" required placeholder="Flat, House no., Building, Company, Apartment"
                              value={address.addressLine1} onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="addressLine1" />
                          </div>
                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Address Line 2 (Optional)</label>
                            <input type="text" placeholder="Area, Street, Sector, Village" value={address.addressLine2}
                              onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="addressLine2" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">City *</label>
                            <input type="text" required placeholder="Bengaluru" value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="city" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">State *</label>
                            <input type="text" required placeholder="Karnataka" value={address.state}
                              onChange={(e) => setAddress({ ...address, state: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="state" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Pincode *</label>
                            <input type="text" required placeholder="560001" value={address.pincode}
                              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="pincode" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Country *</label>
                            <select value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}
                              className="input border-white/8 rounded-xl text-xs" id="country-select">
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Shipping Method */}
                    {activeStep === 1 && (
                      <div className="space-y-6">
                        <div>
                          <span className="section-label mb-3 inline-flex">Logistics</span>
                          <h2 className="font-display font-black text-2xl text-white">Shipping Speed</h2>
                        </div>
                        <div className="grid gap-4">
                          {[
                            { id: "standard", label: "Standard Delivery", desc: "Estimated delivery in 3-5 business days", price: 0 },
                            { id: "express", label: "Express Delivery", desc: "Estimated delivery in 1-2 business days", price: 149 },
                            { id: "same_day", label: "Same Day Delivery", desc: "Delivery by 9:00 PM today", price: 299 },
                          ].map((method) => (
                            <button key={method.id} onClick={() => setShippingMethod(method.id)}
                              className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                                shippingMethod === method.id
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-white/5 hover:border-primary/20 bg-surface-2/20"
                              }`}>
                              <div>
                                <p className="font-bold text-white text-base">{method.label}</p>
                                <p className="text-white/40 text-xs mt-1">{method.desc}</p>
                              </div>
                              <span className={`font-black text-sm ${method.price === 0 ? "text-success" : "text-white"}`}>
                                {method.price === 0 ? "FREE" : `₹${method.price}`}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Gift wrapping widget */}
                        <div className="p-5 rounded-3xl bg-surface-2 border border-white/5 flex items-center justify-between gap-4 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Gift className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">Add Luxury Gift Wrapping</p>
                              <p className="text-white/40 text-[10px]">Textured gift wrap &amp; custom cards (+₹49)</p>
                            </div>
                          </div>
                          <button onClick={() => setGiftWrapping(!giftWrapping)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                              giftWrapping
                                ? "bg-primary text-white"
                                : "bg-surface-3 text-white/50 hover:bg-primary/20 hover:text-primary"
                            }`}>
                            {giftWrapping ? "Added" : "Add wrapping"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment details */}
                    {activeStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <span className="section-label mb-3 inline-flex">Billing</span>
                          <h2 className="font-display font-black text-2xl text-white">Select Payment Method</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {[
                            { id: "upi", label: "BHIM UPI / UPI Apps", desc: "GPay, Paytm, PhonePe instapays" },
                            { id: "card", label: "Credit or Debit Card", desc: "Visa, MasterCard, RuPay cards" },
                            { id: "cod", label: "Cash On Delivery (COD)", desc: "Pay cash when item is delivered" },
                            { id: "netbanking", label: "Net Banking", desc: "All Indian national banks" },
                          ].map((pay) => (
                            <button key={pay.id} onClick={() => setPaymentMethod(pay.id)}
                              className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                                paymentMethod === pay.id
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-white/5 hover:border-primary/20 bg-surface-2/20"
                              }`}>
                              <p className="font-bold text-white text-xs">{pay.label}</p>
                              <p className="text-white/40 text-[10px] mt-2.5 leading-relaxed">{pay.desc}</p>
                            </button>
                          ))}
                        </div>

                        {/* Animated Credit Card Fields */}
                        <AnimatePresence>
                          {paymentMethod === "card" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-5 overflow-hidden"
                            >
                              {/* Credit card design preview */}
                              <div className="relative w-full max-w-[340px] aspect-[1.58/1] rounded-2xl p-5 mx-auto bg-gradient-to-br from-primary via-secondary to-electric border border-white/20 shadow-2xl flex flex-col justify-between text-white select-none">
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-black tracking-widest uppercase opacity-75">NEXMART PREMIUM</span>
                                  <CreditCard className="w-8 h-8 opacity-75" />
                                </div>
                                <p className="font-display font-bold text-lg tracking-widest mt-6">
                                  {cardDetails.number || "•••• •••• •••• ••••"}
                                </p>
                                <div className="flex justify-between items-end mt-4">
                                  <div>
                                    <p className="text-[8px] opacity-40 uppercase tracking-widest">Cardholder</p>
                                    <p className="text-xs font-bold uppercase truncate max-w-[150px]">{cardDetails.name || "JOHN DOE"}</p>
                                  </div>
                                  <div>
                                    <p className="text-[8px] opacity-40 uppercase tracking-widest">Expiry</p>
                                    <p className="text-xs font-bold">{cardDetails.expiry || "MM/YY"}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Card input forms */}
                              <div className="p-6 rounded-3xl bg-surface-2 border border-white/5 grid gap-4 shadow-sm">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Card Number</label>
                                  <input type="text" placeholder="1234 5678 9012 3456"
                                    className="input border-white/8 rounded-xl text-xs" value={cardDetails.number}
                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19) })}
                                    id="card-number" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Cardholder Name</label>
                                  <input type="text" placeholder="JOHN DOE"
                                    className="input border-white/8 rounded-xl text-xs uppercase" value={cardDetails.name}
                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    id="card-name" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Expiry Date</label>
                                    <input type="text" placeholder="MM/YY"
                                      className="input border-white/8 rounded-xl text-xs" value={cardDetails.expiry}
                                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value.replace(/\D/g, "").replace(/(.{2})/, "$1/").slice(0, 5) })}
                                      id="card-expiry" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">CVV</label>
                                    <input type="password" placeholder="•••"
                                      className="input border-white/8 rounded-xl text-xs" value={cardDetails.cvv}
                                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                                      id="card-cvv" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Back / Next action bar */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8">
                      <button onClick={handleBack} disabled={activeStep === 0}
                        className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:text-white/60 font-bold text-xs uppercase tracking-wider transition-all">
                        Back
                      </button>
                      <button onClick={handleNext}
                        className="btn-primary flex items-center gap-2 px-8 py-3.5 text-xs font-black uppercase tracking-wider">
                        {activeStep === STEPS.length - 1 ? "Place Order" : "Continue"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* Right Column: Sticky Summary Panel (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card rounded-3xl border border-white/8 p-6 space-y-6 bg-surface-2 sticky top-28 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="font-display font-bold text-base text-white">Order Summary</h3>
                  <span className="badge badge-primary text-[9px]">{items.length} items</span>
                </div>

                {/* Mini Item List */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-3 flex-shrink-0 border border-white/5">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">{item.product.name}</p>
                        <p className="text-[10px] text-white/40 mt-0.5 font-semibold">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-white">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-white/5 text-xs">
                  <div className="flex justify-between text-white/50">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>GST (18%)</span>
                    <span>{formatCurrency(gstCost)}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Shipping Speed Charge</span>
                    <span>{shippingCost === 0 ? <span className="text-success font-semibold">FREE</span> : formatCurrency(shippingCost)}</span>
                  </div>
                  {giftWrapping && (
                    <div className="flex justify-between text-white/50">
                      <span>Luxury wrapping fee</span>
                      <span>{formatCurrency(49)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display font-black text-white text-base pt-4 border-t border-white/5">
                    <span>Total Amount</span>
                    <span className="gradient-text">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Secure SSL badge */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>Secure Payments by Razorpay</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
