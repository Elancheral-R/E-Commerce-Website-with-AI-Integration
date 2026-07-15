"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Building2, CreditCard, Landmark, CheckCircle2,
  FileText, Hash, ChevronRight, ChevronLeft, Zap,
  Upload, AlertCircle, Shield, Percent, Sparkles, TrendingUp
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

interface BecomeSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalFlowState = "info" | "kyc" | "done";

const STEPS = [
  { id: 1, title: "Business Info" },
  { id: 2, title: "Identity Docs" },
  { id: 3, title: "Bank Info" },
  { id: 4, title: "Verify & Agree" },
];

export function BecomeSellerModal({ isOpen, onClose }: BecomeSellerModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [flowState, setFlowState] = useState<ModalFlowState>("info");
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    businessName: "",
    gstNumber: "",
    panNumber: "",
    businessType: "individual" as "individual" | "partnership" | "company",
    businessAddress: "",
    aadhaarNumber: "",
    aadhaarImageUrl: "",
    panImageUrl: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountHolderName: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFlowState("info");
      setCurrentStep(1);
      setAgreed(false);
      setError("");
      setSubmitting(false);
    }
  }, [isOpen]);

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateKYCStep = () => {
    if (currentStep === 1) {
      if (!form.businessName || !form.gstNumber || !form.panNumber || !form.businessAddress) {
        setError("Please fill in all business details.");
        return false;
      }
      if (form.gstNumber.length !== 15) {
        setError("GST Number must be exactly 15 characters.");
        return false;
      }
      if (form.panNumber.length !== 10) {
        setError("PAN Number must be exactly 10 characters.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!form.aadhaarNumber || form.aadhaarNumber.replace(/\s/g, "").length !== 12) {
        setError("Please enter a valid 12-digit Aadhaar number.");
        return false;
      }
      if (!form.aadhaarImageUrl) {
        setError("Please enter your Aadhaar card image URL.");
        return false;
      }
      if (!form.panImageUrl) {
        setError("Please enter your PAN card image URL.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!form.accountNumber || !form.ifscCode || !form.bankName || !form.accountHolderName) {
        setError("Please fill in all bank details.");
        return false;
      }
      if (form.ifscCode.length !== 11) {
        setError("IFSC Code must be exactly 11 characters.");
        return false;
      }
    }
    if (currentStep === 4) {
      if (!agreed) {
        setError("Please agree to the commission policy to submit your application.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateKYCStep()) return;
    setError("");
    setCurrentStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const handleStartApply = () => {
    if (!isAuthenticated) {
      onClose();
      router.push("/auth/register?role=seller");
      return;
    }
    if (user?.role === "seller" || user?.role === "seller-pending") {
      onClose();
      router.push("/seller/dashboard");
      return;
    }
    setFlowState("kyc");
  };

  const handleSubmit = async () => {
    if (!validateKYCStep() || !user) return;
    setSubmitting(true);

    // Simulate database write
    await new Promise((r) => setTimeout(r, 1000));

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

    // Save to local applications
    const existing = JSON.parse(localStorage.getItem("nexmart-seller-applications") || "[]");
    existing.push(application);
    localStorage.setItem("nexmart-seller-applications", JSON.stringify(existing));

    // Update user local database role to seller-pending
    const users = JSON.parse(localStorage.getItem("nexmart-users-db") || "[]");
    const updatedUsers = users.map((u: any) =>
      u.id === user.id ? { ...u, role: "seller-pending" } : u
    );
    localStorage.setItem("nexmart-users-db", JSON.stringify(updatedUsers));

    // Update frontend Zustand auth store state
    updateUser({ role: "seller-pending" });

    setSubmitting(false);
    setFlowState("done");

    // Auto close and route after delay
    setTimeout(() => {
      onClose();
      router.push("/seller/dashboard");
    }, 2200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative bg-surface border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-lg text-text-primary">
                {flowState === "kyc" ? "Seller KYC Verification" : "Become a NexMart Merchant"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-surface-2 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-3 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <AnimatePresence mode="wait">

              {/* ─── STATE: Welcome & Info ─── */}
              {flowState === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="text-center max-w-md mx-auto py-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/10">
                      <Sparkles className="w-7 h-7 text-white fill-white" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-text-primary">Sell to Millions on NexMart</h3>
                    <p className="text-text-muted text-xs mt-2 leading-relaxed">
                      NexMart connects your merchant catalog directly to millions of customers using AI-powered search optimization.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: Percent, title: "10% Commission", desc: "No listing fees, no setup costs. Only pay when you sell." },
                      { icon: Zap, title: "AI Marketing", desc: "Products are dynamically auto-recommended to target customers." },
                      { icon: TrendingUp, title: "Interactive Analytics", desc: "Premium analytics dashboard to track and optimize operations." }
                    ].map((feat, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-border bg-surface-2 space-y-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                          <feat.icon className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="font-bold text-text-primary text-xs">{feat.title}</h4>
                        <p className="text-text-secondary text-[11px] leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15 flex items-start gap-3">
                    <Shield className="w-4.5 h-4.5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-primary text-xs">KYC Verification Required</h4>
                      <p className="text-text-secondary text-[11px] leading-relaxed mt-1">
                        To maintain standard safety benchmarks, you need to submit active business registration proofs (GST & PAN) and valid identity documents before you can publish catalog items.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartApply}
                    className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-4"
                  >
                    {isAuthenticated ? "Start Onboarding Application" : "Create Account & Apply"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ─── STATE: KYC Form ─── */}
              {flowState === "kyc" && (
                <motion.div
                  key="kyc"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-1.5 justify-between bg-surface-2 p-1.5 rounded-2xl border border-border">
                    {STEPS.map((step) => {
                      const active = step.id === currentStep;
                      const done = step.id < currentStep;
                      return (
                        <div
                          key={step.id}
                          className={`flex-1 text-center py-2 rounded-xl text-[10px] font-bold transition-all ${
                            active
                              ? "bg-primary text-white"
                              : done
                              ? "text-primary bg-primary/8 font-bold"
                              : "text-text-muted"
                          }`}
                        >
                          Step {step.id}: {step.title}
                        </div>
                      );
                    })}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-xl bg-danger/8 border border-danger/15 text-danger text-xs font-semibold"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {/* STEP 1: Business Details */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Business / Shop Name *</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Building2 className="w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            placeholder="e.g. Acme Electronics Inc."
                            value={form.businessName}
                            onChange={(e) => setField("businessName", e.target.value)}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-secondary uppercase">GSTIN * (15 Characters)</label>
                          <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                            <Hash className="w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              placeholder="22AAAAA0000A1Z5"
                              value={form.gstNumber}
                              onChange={(e) => setField("gstNumber", e.target.value.toUpperCase().slice(0, 15))}
                              className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-secondary uppercase">PAN Number * (10 Characters)</label>
                          <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                            <CreditCard className="w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              placeholder="ABCDE1234F"
                              value={form.panNumber}
                              onChange={(e) => setField("panNumber", e.target.value.toUpperCase().slice(0, 10))}
                              className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase">Business Type *</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["individual", "partnership", "company"] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, businessType: type }))}
                              className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
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

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Business Address *</label>
                        <textarea
                          placeholder="Registered physical office or shop address..."
                          value={form.businessAddress}
                          onChange={(e) => setField("businessAddress", e.target.value)}
                          rows={2}
                          className="w-full bg-surface-2 rounded-xl border border-border px-3.5 py-2 text-sm text-text-primary outline-none resize-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Identity Documents */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Aadhaar Number * (12 Digits)</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Hash className="w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            placeholder="1234 5678 9012"
                            value={form.aadhaarNumber}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
                              const formatted = raw.replace(/(\d{4})(\d{4})?(\d{4})?/, (_, a, b, c) =>
                                [a, b, c].filter(Boolean).join(" ")
                              );
                              setField("aadhaarNumber", formatted);
                            }}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Aadhaar Copy Image URL *</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Upload className="w-4 h-4 text-text-muted" />
                          <input
                            type="url"
                            placeholder="https://drive.google.com/..."
                            value={form.aadhaarImageUrl}
                            onChange={(e) => setField("aadhaarImageUrl", e.target.value)}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">PAN Card Image URL *</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Upload className="w-4 h-4 text-text-muted" />
                          <input
                            type="url"
                            placeholder="https://drive.google.com/..."
                            value={form.panImageUrl}
                            onChange={(e) => setField("panImageUrl", e.target.value)}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Bank Details */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Account Holder Name *</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Landmark className="w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            placeholder="Exact name as in bank records"
                            value={form.accountHolderName}
                            onChange={(e) => setField("accountHolderName", e.target.value)}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-text-secondary uppercase">Bank Name *</label>
                        <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                          <Building2 className="w-4 h-4 text-text-muted" />
                          <input
                            type="text"
                            placeholder="e.g. HDFC Bank"
                            value={form.bankName}
                            onChange={(e) => setField("bankName", e.target.value)}
                            className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-secondary uppercase">Account Number *</label>
                          <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                            <Hash className="w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              placeholder="e.g. 5010029384729"
                              value={form.accountNumber}
                              onChange={(e) => setField("accountNumber", e.target.value.replace(/\D/g, ""))}
                              className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-text-secondary uppercase">IFSC Code * (11 Characters)</label>
                          <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                            <Hash className="w-4 h-4 text-text-muted" />
                            <input
                              type="text"
                              placeholder="e.g. HDFC0000123"
                              value={form.ifscCode}
                              onChange={(e) => setField("ifscCode", e.target.value.toUpperCase().slice(0, 11))}
                              className="flex-1 bg-transparent text-sm text-text-primary outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Review & Agree */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-primary" />
                          <h4 className="font-bold text-text-primary text-xs">Agreement Details</h4>
                        </div>
                        <p className="text-text-secondary text-[11px] leading-relaxed">
                          By completing onboarding, you confirm listing on NexMart at a <strong className="text-primary">10% flat commission rate</strong> deducted directly from order sales. Out-of-state logistics and payouts are cleared weekly.
                        </p>
                        <label className="flex items-start gap-2.5 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
                            className="mt-0.5 w-4.5 h-4.5 accent-primary cursor-pointer"
                          />
                          <span className="text-[11px] text-text-secondary select-none hover:text-text-primary transition-colors">
                            I authorize verification of my records and accept the 10% platform service fee.
                          </span>
                        </label>
                      </div>

                      {/* Display Data Preview */}
                      <div className="p-3 rounded-2xl border border-border bg-surface-2 space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-text-muted">Business Name</span><span className="font-semibold text-text-primary">{form.businessName}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">GST Number</span><span className="font-semibold text-text-primary font-mono">{form.gstNumber}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Aadhaar (Masked)</span><span className="font-semibold text-text-primary font-mono">•••• •••• {form.aadhaarNumber.slice(-4)}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Payout Account</span><span className="font-semibold text-text-primary font-mono">••••{form.accountNumber.slice(-4)}</span></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t border-border mt-6">
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary transition-all flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    {currentStep < 4 ? (
                      <button
                        onClick={handleNext}
                        className="btn-primary px-5 py-2 rounded-xl text-xs flex items-center gap-1"
                      >
                        Continue <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn-primary px-6 py-2 rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application <CheckCircle2 className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── STATE: Success Onboarding ─── */}
              {flowState === "done" && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-text-primary">Application Submitted!</h3>
                    <p className="text-text-muted text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                      Your business request is under review. Our administrators will validate your records. Redirecting to your merchant console…
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
