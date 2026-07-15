"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, CreditCard, Landmark, CheckCircle2,
  FileText, Hash, ChevronRight, ChevronLeft, Zap,
  Upload, AlertCircle, Shield, Percent
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth";

const STEPS = [
  { id: 1, title: "Business Details", icon: Building2, desc: "Tell us about your business" },
  { id: 2, title: "ID Proof", icon: FileText, desc: "Government-issued documents" },
  { id: 3, title: "Bank Details", icon: Landmark, desc: "Where we send your payouts" },
  { id: 4, title: "Review & Submit", icon: CheckCircle2, desc: "Confirm and apply" },
];

interface KYCFormData {
  // Step 1
  businessName: string;
  gstNumber: string;
  panNumber: string;
  businessType: "individual" | "partnership" | "company" | "";
  businessAddress: string;
  // Step 2
  aadhaarNumber: string;
  aadhaarImageUrl: string;
  panImageUrl: string;
  // Step 3
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
}

const initialForm: KYCFormData = {
  businessName: "",
  gstNumber: "",
  panNumber: "",
  businessType: "",
  businessAddress: "",
  aadhaarNumber: "",
  aadhaarImageUrl: "",
  panImageUrl: "",
  accountNumber: "",
  ifscCode: "",
  bankName: "",
  accountHolderName: "",
};

export default function SellerKYCPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<KYCFormData>(initialForm);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  const set = (field: keyof KYCFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.businessName || !form.gstNumber || !form.panNumber || !form.businessType || !form.businessAddress) {
        setError("Please fill in all business details.");
        return false;
      }
      if (form.gstNumber.length !== 15) {
        setError("GST Number must be 15 characters.");
        return false;
      }
      if (form.panNumber.length !== 10) {
        setError("PAN Number must be 10 characters.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!form.aadhaarNumber || form.aadhaarNumber.replace(/\s/g, "").length !== 12) {
        setError("Please enter a valid 12-digit Aadhaar number.");
        return false;
      }
      if (!form.aadhaarImageUrl) {
        setError("Please provide your Aadhaar image URL.");
        return false;
      }
      if (!form.panImageUrl) {
        setError("Please provide your PAN card image URL.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!form.accountNumber || !form.ifscCode || !form.bankName || !form.accountHolderName) {
        setError("Please fill in all bank details.");
        return false;
      }
      if (form.ifscCode.length !== 11) {
        setError("IFSC Code must be 11 characters.");
        return false;
      }
    }
    if (currentStep === 4) {
      if (!agreed) {
        setError("Please agree to the commission terms to proceed.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setError("");
    setCurrentStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    if (!user) return;

    // Save application to localStorage
    const application = {
      id: `app-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status: "pending",
      commissionRate: 10,
      submittedAt: new Date().toISOString(),
      ...form,
    };

    const existing = JSON.parse(localStorage.getItem("nexmart-seller-applications") || "[]");
    existing.push(application);
    localStorage.setItem("nexmart-seller-applications", JSON.stringify(existing));

    // Update user status in nexmart-users-db to seller-pending
    const users = JSON.parse(localStorage.getItem("nexmart-users-db") || "[]");
    const updated = users.map((u: any) =>
      u.id === user.id ? { ...u, role: "seller-pending" } : u
    );
    localStorage.setItem("nexmart-users-db", JSON.stringify(updated));

    setSubmitted(true);
    setTimeout(() => router.push("/seller/dashboard"), 3000);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full mx-auto text-center px-4"
          >
            <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-display font-bold text-2xl text-text-primary mb-3">Application Submitted!</h1>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Your seller application is under review. Our team will verify your documents within 24–48 hours. You will be notified once approved.
            </p>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 text-sm text-primary font-semibold">
              Redirecting you to Seller Dashboard…
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <h1 className="font-display font-bold text-3xl text-text-primary">Become a NexMart Seller</h1>
            <p className="text-text-muted text-sm mt-2">Complete your KYC verification to start selling on India's smartest commerce platform.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-border z-0" />
            <div
              className="absolute left-0 top-5 h-0.5 bg-primary z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
            {STEPS.map((step) => {
              const Icon = step.icon;
              const done = step.id < currentStep;
              const active = step.id === currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done ? "bg-primary border-primary" : active ? "bg-primary/10 border-primary" : "bg-surface border-border"
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Icon className={`w-4.5 h-4.5 ${active ? "text-primary" : "text-text-muted"}`} />}
                  </div>
                  <span className={`text-[10px] font-bold hidden sm:block ${active ? "text-primary" : done ? "text-text-secondary" : "text-text-muted"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-3xl border border-border p-8 bg-surface">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Step Header */}
                <div className="mb-8">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step {currentStep} of 4</span>
                  <h2 className="font-display font-bold text-xl text-text-primary mt-1">{STEPS[currentStep - 1].title}</h2>
                  <p className="text-text-muted text-sm mt-1">{STEPS[currentStep - 1].desc}</p>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-danger/8 border border-danger/15 text-danger text-xs font-semibold mb-6"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* ─── Step 1: Business Details ─── */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Business Name *</label>
                      <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                        <Building2 className="w-4 h-4 text-text-muted flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="My Business Pvt. Ltd."
                          value={form.businessName}
                          onChange={(e) => set("businessName", e.target.value)}
                          className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">GST Number * (15 chars)</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Hash className="w-4 h-4 text-text-muted flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="22AAAAA0000A1Z5"
                            value={form.gstNumber}
                            onChange={(e) => set("gstNumber", e.target.value.toUpperCase().slice(0, 15))}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">PAN Number * (10 chars)</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <CreditCard className="w-4 h-4 text-text-muted flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="ABCDE1234F"
                            value={form.panNumber}
                            onChange={(e) => set("panNumber", e.target.value.toUpperCase().slice(0, 10))}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Business Type *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["individual", "partnership", "company"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => set("businessType", type)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                              form.businessType === type
                                ? "bg-primary border-primary text-white"
                                : "border-border text-text-secondary hover:border-primary/40 hover:text-primary"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Business Address *</label>
                      <textarea
                        placeholder="123, Business Park, Street Name, City, State - 400001"
                        value={form.businessAddress}
                        onChange={(e) => set("businessAddress", e.target.value)}
                        rows={3}
                        className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus:border-primary transition-all text-sm text-text-primary outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* ─── Step 2: ID Proof ─── */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
                      <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Your documents are securely stored and used only for KYC verification. We comply with all Indian data protection regulations.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Aadhaar Number * (12 digits)</label>
                      <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                        <Hash className="w-4 h-4 text-text-muted flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="1234 5678 9012"
                          value={form.aadhaarNumber}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
                            const formatted = digits.replace(/(\d{4})(\d{4})?(\d{4})?/, (_, a, b, c) =>
                              [a, b, c].filter(Boolean).join(" ")
                            );
                            set("aadhaarNumber", formatted);
                          }}
                          className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono tracking-widest"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Aadhaar Card Image URL *</label>
                      <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                        <Upload className="w-4 h-4 text-text-muted flex-shrink-0" />
                        <input
                          type="url"
                          placeholder="https://drive.google.com/your-aadhaar-image"
                          value={form.aadhaarImageUrl}
                          onChange={(e) => set("aadhaarImageUrl", e.target.value)}
                          className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-text-muted ml-1">Upload to Google Drive / Dropbox and paste the public link here.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">PAN Card Image URL *</label>
                      <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                        <Upload className="w-4 h-4 text-text-muted flex-shrink-0" />
                        <input
                          type="url"
                          placeholder="https://drive.google.com/your-pan-image"
                          value={form.panImageUrl}
                          onChange={(e) => set("panImageUrl", e.target.value)}
                          className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-text-muted ml-1">Upload to Google Drive / Dropbox and paste the public link here.</p>
                    </div>
                  </div>
                )}

                {/* ─── Step 3: Bank Details ─── */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Account Holder Name *</label>
                      <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                        <Landmark className="w-4 h-4 text-text-muted flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Name as on bank account"
                          value={form.accountHolderName}
                          onChange={(e) => set("accountHolderName", e.target.value)}
                          className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Bank Name *</label>
                      <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                        <Building2 className="w-4 h-4 text-text-muted flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="e.g. State Bank of India"
                          value={form.bankName}
                          onChange={(e) => set("bankName", e.target.value)}
                          className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">Account Number *</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Hash className="w-4 h-4 text-text-muted flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="00001234567890"
                            value={form.accountNumber}
                            onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, ""))}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">IFSC Code * (11 chars)</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Hash className="w-4 h-4 text-text-muted flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="SBIN0000123"
                            value={form.ifscCode}
                            onChange={(e) => set("ifscCode", e.target.value.toUpperCase().slice(0, 11))}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Step 4: Review & Submit ─── */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="space-y-4">
                      {[
                        {
                          title: "Business Info",
                          icon: Building2,
                          fields: [
                            ["Business Name", form.businessName],
                            ["GST Number", form.gstNumber],
                            ["PAN Number", form.panNumber],
                            ["Business Type", form.businessType],
                          ],
                        },
                        {
                          title: "ID Proof",
                          icon: FileText,
                          fields: [
                            ["Aadhaar Number", form.aadhaarNumber.replace(/\d(?=\d{4})/g, "•")],
                            ["Aadhaar Image", form.aadhaarImageUrl ? "✓ Provided" : "—"],
                            ["PAN Image", form.panImageUrl ? "✓ Provided" : "—"],
                          ],
                        },
                        {
                          title: "Bank Details",
                          icon: Landmark,
                          fields: [
                            ["Bank Name", form.bankName],
                            ["Account Holder", form.accountHolderName],
                            ["Account Number", `••••${form.accountNumber.slice(-4)}`],
                            ["IFSC Code", form.ifscCode],
                          ],
                        },
                      ].map(({ title, icon: Icon, fields }) => (
                        <div key={title} className="p-4 rounded-2xl bg-surface-2 border border-border">
                          <div className="flex items-center gap-2 mb-3">
                            <Icon className="w-4 h-4 text-primary" />
                            <span className="font-bold text-text-primary text-sm">{title}</span>
                          </div>
                          <div className="space-y-2">
                            {fields.map(([label, value]) => (
                              <div key={label} className="flex justify-between text-xs">
                                <span className="text-text-muted">{label}</span>
                                <span className="font-semibold text-text-primary capitalize">{value || "—"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Commission Terms */}
                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Percent className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-text-primary text-sm">NexMart Commission Policy</p>
                          <p className="text-text-muted text-xs">Platform fee per successful sale</p>
                        </div>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed mb-4">
                        NexMart charges a <strong className="text-primary">10% commission</strong> on each completed sale. This covers payment gateway, platform maintenance, customer support, and marketing. Payouts are processed within 7 business days of order delivery.
                      </p>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
                          className="mt-0.5 w-4 h-4 accent-primary cursor-pointer"
                        />
                        <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                          I agree to the NexMart Seller Agreement and accept the <strong className="text-primary">10% commission</strong> on all sales made through the platform.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:text-text-primary hover:border-primary/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm"
                >
                  Submit Application
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
