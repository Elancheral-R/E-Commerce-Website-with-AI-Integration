"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Building2, CreditCard, FileText, MapPin, Phone, Mail,
  Clock, Save, CheckCircle, Camera, Shield,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "store", label: "Store Info", icon: Building2 },
  { id: "bank", label: "Bank Details", icon: CreditCard },
  { id: "documents", label: "Documents", icon: FileText },
];

const DEFAULT_PROFILE = {
  businessName: "", storeName: "", storeDescription: "", storeLogo: "",
  gstNumber: "", panNumber: "", phone: "", email: "", address: "",
  city: "", state: "", pincode: "", pickupAddress: "", businessHours: "9:00 AM – 6:00 PM",
  bankAccountName: "", bankAccountNumber: "", ifscCode: "", bankName: "", branchName: "",
  gstCertUrl: "", panCardUrl: "",
};

export default function SellerProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState("store");
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) return;
    const saved = localStorage.getItem(`nexmart-seller-profile-${user.id}`);
    if (saved) {
      setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(saved) });
    } else {
      setProfile((p) => ({ ...p, email: user.email, businessName: user.name }));
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    localStorage.setItem(`nexmart-seller-profile-${user.id}`, JSON.stringify(profile));
    // Optionally update the user display name
    if (profile.businessName && profile.businessName !== user.name) {
      updateUser({ name: profile.businessName });
    }
    setTimeout(() => {
      setSaving(false);
      showToast("Profile saved successfully!");
    }, 700);
  };

  const f = (key: keyof typeof DEFAULT_PROFILE) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile((p) => ({ ...p, [key]: e.target.value }));

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-success text-white text-sm font-bold shadow-xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Account</p>
          <h1 className="font-display font-black text-2xl text-text-primary">Store Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:bg-primary/90 disabled:opacity-60 transition-all"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
          ) : (
            <><Save className="w-4 h-4" />Save Changes</>
          )}
        </button>
      </div>

      {/* Profile Avatar Card */}
      <div className="relative z-10 p-6 rounded-2xl bg-surface border border-border shadow-card">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
              {profile.storeLogo ? (
                <img src={profile.storeLogo} alt="Store logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors shadow-sm">
              <Camera className="w-3.5 h-3.5 text-text-muted" />
            </div>
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-text-primary">{profile.businessName || user?.name || "Your Store"}</h2>
            <p className="text-text-muted text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-success text-[9px]"><Shield className="w-2.5 h-2.5 inline mr-0.5" />Verified Seller</span>
              <span className="badge badge-primary text-[9px]">10% Commission</span>
            </div>
          </div>
        </div>
        {/* Logo URL input */}
        <div className="mt-4 space-y-1">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Store Logo URL</label>
          <input value={profile.storeLogo} onChange={f("storeLogo")} placeholder="https://example.com/logo.png"
            className="input border-border rounded-xl text-sm text-text-primary w-full" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 border border-border rounded-xl p-1 relative z-10 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
              tab === t.id ? "bg-primary text-white shadow" : "text-text-muted hover:text-text-primary")}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          {tab === "store" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Business Info */}
              <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
                <h3 className="font-display font-bold text-sm text-text-primary flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Business Information
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Business / Legal Name", key: "businessName", placeholder: "Acme Technologies Pvt. Ltd." },
                    { label: "Store Display Name", key: "storeName", placeholder: "TechZone Official" },
                    { label: "GST Number", key: "gstNumber", placeholder: "22ABCDE1234F1Z5" },
                    { label: "PAN Number", key: "panNumber", placeholder: "ABCDE1234F" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</label>
                      <input value={profile[key as keyof typeof DEFAULT_PROFILE]} onChange={f(key as keyof typeof DEFAULT_PROFILE)}
                        placeholder={placeholder} className="input border-border rounded-xl text-sm text-text-primary w-full" />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Store Description</label>
                    <textarea value={profile.storeDescription} onChange={f("storeDescription")}
                      placeholder="Tell customers about your store..."
                      className="input border-border rounded-xl text-sm text-text-primary w-full h-24 resize-none" />
                  </div>
                </div>
              </div>

              {/* Contact & Address */}
              <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
                <h3 className="font-display font-bold text-sm text-text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Contact & Address
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Phone Number", key: "phone", placeholder: "+91 98765 43210", icon: Phone },
                    { label: "Business Email", key: "email", placeholder: "store@business.com", icon: Mail },
                    { label: "Business Address", key: "address", placeholder: "123, Commercial Street" },
                    { label: "City", key: "city", placeholder: "Bengaluru" },
                    { label: "State", key: "state", placeholder: "Karnataka" },
                    { label: "Pincode", key: "pincode", placeholder: "560001" },
                    { label: "Pickup Address", key: "pickupAddress", placeholder: "Warehouse / Pickup location" },
                    { label: "Business Hours", key: "businessHours", placeholder: "9:00 AM – 6:00 PM", icon: Clock },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</label>
                      <input value={profile[key as keyof typeof DEFAULT_PROFILE]} onChange={f(key as keyof typeof DEFAULT_PROFILE)}
                        placeholder={placeholder} className="input border-border rounded-xl text-sm text-text-primary w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "bank" && (
            <div className="max-w-xl p-6 rounded-2xl bg-surface border border-border shadow-card space-y-5">
              <h3 className="font-display font-bold text-sm text-text-primary flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" /> Bank Account Details
              </h3>
              <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-xs text-warning font-semibold">
                ⚠️ Bank details are used for payouts. Ensure accuracy. Never share these with anyone.
              </div>
              <div className="space-y-4">
                {[
                  { label: "Account Holder Name", key: "bankAccountName", placeholder: "As per bank records" },
                  { label: "Account Number", key: "bankAccountNumber", placeholder: "1234567890123456" },
                  { label: "IFSC Code", key: "ifscCode", placeholder: "HDFC0001234" },
                  { label: "Bank Name", key: "bankName", placeholder: "HDFC Bank" },
                  { label: "Branch Name", key: "branchName", placeholder: "MG Road, Bengaluru" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</label>
                    <input value={profile[key as keyof typeof DEFAULT_PROFILE]} onChange={f(key as keyof typeof DEFAULT_PROFILE)}
                      placeholder={placeholder} className="input border-border rounded-xl text-sm text-text-primary w-full" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "documents" && (
            <div className="max-w-xl p-6 rounded-2xl bg-surface border border-border shadow-card space-y-5">
              <h3 className="font-display font-bold text-sm text-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Compliance Documents
              </h3>
              <div className="p-4 rounded-xl bg-primary/8 border border-primary/20 text-xs text-primary font-semibold">
                📄 Upload links to your compliance documents. Accepted: GST Registration, PAN Card, Trade License.
              </div>
              <div className="space-y-4">
                {[
                  { label: "GST Certificate URL", key: "gstCertUrl", placeholder: "https://docs.example.com/gst.pdf" },
                  { label: "PAN Card Image URL", key: "panCardUrl", placeholder: "https://docs.example.com/pan.jpg" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</label>
                    <input value={profile[key as keyof typeof DEFAULT_PROFILE]} onChange={f(key as keyof typeof DEFAULT_PROFILE)}
                      placeholder={placeholder} className="input border-border rounded-xl text-sm text-text-primary w-full" />
                    {profile[key as keyof typeof DEFAULT_PROFILE] && (
                      <a href={profile[key as keyof typeof DEFAULT_PROFILE]} target="_blank" rel="noopener noreferrer"
                        className="text-primary text-xs font-semibold hover:underline">View document →</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
