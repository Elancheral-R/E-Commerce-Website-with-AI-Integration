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

const STEPS = [
  { id: "address", label: "Shipping Address", icon: MapPin },
  { id: "shipping", label: "Shipping Method", icon: Truck },
  { id: "payment", label: "Payment Details", icon: CreditCard },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, total, clearCart } = useCartStore();
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
      // Simulate Order Placement
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
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Left/Middle Column: Steps & Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Checkout Progress Stepper */}
              <div className="glass-card rounded-2xl border border-border p-6 bg-surface-2 flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        index <= activeStep
                          ? "bg-primary text-white"
                          : "bg-surface-3 text-text-muted border border-border"
                      }`}
                    >
                      {index < activeStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-semibold hidden sm:block ${
                        index === activeStep ? "text-primary" : "text-text-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                    {index < STEPS.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-text-muted hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Forms */}
              <div className="glass-card rounded-3xl border border-border p-8 bg-surface space-y-6">
                
                {/* Step 1: Address */}
                {activeStep === 0 && (
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-2xl text-text-primary flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" />
                      Shipping Address
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                          className="input"
                          id="fullName"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="input"
                          id="phone"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Address Line 1 *</label>
                        <input
                          type="text"
                          required
                          placeholder="Flat, House no., Building, Company, Apartment"
                          value={address.addressLine1}
                          onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                          className="input"
                          id="addressLine1"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          placeholder="Area, Street, Sector, Village"
                          value={address.addressLine2}
                          onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                          className="input"
                          id="addressLine2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">City *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Bengaluru"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="input"
                          id="city"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">State *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Karnataka"
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="input"
                          id="state"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Pincode *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 560001"
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="input"
                          id="pincode"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase">Country *</label>
                        <select
                          value={address.country}
                          onChange={(e) => setAddress({ ...address, country: e.target.value })}
                          className="input"
                          id="country-select"
                        >
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
                    <h2 className="font-display font-bold text-2xl text-text-primary flex items-center gap-2">
                      <Truck className="w-6 h-6 text-primary" />
                      Select Shipping Method
                    </h2>
                    <div className="grid gap-4">
                      {[
                        { id: "standard", label: "Standard Delivery", desc: "Estimated delivery in 3-5 business days", price: 0 },
                        { id: "express", label: "Express Delivery", desc: "Estimated delivery in 1-2 business days", price: 149 },
                        { id: "same_day", label: "Same Day Delivery", desc: "Delivery by 9:00 PM today (if ordered before 2:00 PM)", price: 299 },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setShippingMethod(method.id)}
                          className={`w-full text-left p-5 rounded-2xl border flex items-center justify-between transition-all ${
                            shippingMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-text-primary text-base">{method.label}</p>
                            <p className="text-text-muted text-sm mt-1">{method.desc}</p>
                          </div>
                          <span className={`font-bold ${method.price === 0 ? "text-success" : "text-text-primary"}`}>
                            {method.price === 0 ? "FREE" : `₹${method.price}`}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Gift Wrapping Panel */}
                    <div className="p-5 rounded-2xl bg-surface-2 border border-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Gift className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-semibold text-text-primary text-sm">Add Gift Wrapping</p>
                          <p className="text-text-muted text-xs">Elegant paper wrap & personalized gift message cards</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setGiftWrapping(!giftWrapping)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          giftWrapping
                            ? "bg-primary text-white"
                            : "bg-surface-3 text-text-secondary hover:bg-primary/20 hover:text-primary"
                        }`}
                      >
                        {giftWrapping ? "Added (₹49)" : "Add Wrapping"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment details */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-display font-bold text-2xl text-text-primary flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-primary" />
                      Select Payment Method
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { id: "upi", label: "BHIM UPI / GPay / Paytm", desc: "Pay instantly via your mobile app" },
                        { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay, Maestro" },
                        { id: "cod", label: "Cash On Delivery (COD)", desc: "Pay cash at the time of delivery" },
                        { id: "netbanking", label: "Net Banking", desc: "All major Indian banks supported" },
                      ].map((pay) => (
                        <button
                          key={pay.id}
                          onClick={() => setPaymentMethod(pay.id)}
                          className={`w-full text-left p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                            paymentMethod === pay.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <p className="font-semibold text-text-primary text-base">{pay.label}</p>
                          <p className="text-text-muted text-xs mt-2">{pay.desc}</p>
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "card" && (
                      <div className="p-6 rounded-2xl bg-surface-2 border border-border grid gap-4 mt-4 animate-scale-in">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-text-secondary uppercase">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="input"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            id="card-number"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-text-secondary uppercase">Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className="input"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                            id="card-name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-text-secondary uppercase">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="input"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              id="card-expiry"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-text-secondary uppercase">CVV</label>
                            <input
                              type="password"
                              placeholder="123"
                              className="input"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              id="card-cvv"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
                  <button
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    className="px-6 py-3 rounded-xl border border-border text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:hover:text-text-secondary font-medium transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-primary flex items-center gap-2 px-8 py-3.5"
                  >
                    {activeStep === STEPS.length - 1 ? "Place Order" : "Continue"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Right Column: Checkout Summary Panel */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl border border-border p-6 space-y-6 bg-surface-2 sticky top-28">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="font-display font-bold text-lg text-text-primary">Order Summary</h3>
                  <span className="badge badge-primary">{items.length} items</span>
                </div>

                {/* Mini Item List */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-3 flex-shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate">{item.product.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-text-primary">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-border text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Items Subtotal</span>
                    <span>{formatCurrency(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>GST (18%)</span>
                    <span>{formatCurrency(gstCost)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping Charges</span>
                    <span>{shippingCost === 0 ? <span className="text-success">FREE</span> : formatCurrency(shippingCost)}</span>
                  </div>
                  {giftWrapping && (
                    <div className="flex justify-between text-text-secondary">
                      <span>Gift Wrapping</span>
                      <span>{formatCurrency(49)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-display font-bold text-lg text-text-primary pt-3 border-t border-border">
                    <span>Total Amount</span>
                    <span className="gradient-text">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Security Trust Badge */}
                <div className="pt-4 border-t border-border flex items-center justify-center gap-2 text-xs text-text-muted">
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
