"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, Zap, Eye, EyeOff, User, Phone } from "lucide-react";
import { signIn } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser, isLoading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"customer" | "seller">("customer");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/auth/google-callback?callbackUrl=/" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    const result = await registerUser(name, email, password, role, phone);
    if (result.success) {
      if (role === "seller") {
        // Sellers must complete KYC before accessing seller dashboard
        router.push("/auth/seller-kyc");
      } else {
        router.push("/");
      }
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16 flex flex-col justify-center">
        <div className="max-w-[1400px] w-full mx-auto px-4 md:px-6">
          <div className="max-w-md mx-auto glass-card rounded-3xl border border-border p-8 bg-surface space-y-6">

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto glow-primary">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <h1 className="font-display font-bold text-2xl text-text-primary">Create Account</h1>
              <p className="text-text-muted text-sm">Join NexMart and start shopping smarter</p>
            </div>

            {/* Google Sign-Up Button */}
            <motion.button
              type="button"
              id="register-google"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface-2 hover:bg-surface hover:border-primary/40 transition-all font-semibold text-sm text-text-primary disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {googleLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-text-muted/30 border-t-primary rounded-full animate-spin" />
                  Connecting to Google…
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted font-medium">or create account with email</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-danger font-medium bg-danger/8 border border-danger/15 rounded-xl px-3 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase">Account Type</label>
                <div className="grid grid-cols-2 gap-2 bg-surface-2 p-1.5 rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      role === "customer"
                        ? "bg-primary text-white shadow-md animate-none"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Customer (Buyer)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      role === "seller"
                        ? "bg-primary text-white shadow-md animate-none"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    Seller (Merchant)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="register-name">Full Name</label>
                <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                  <User className="w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(""); }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    id="register-name"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="register-phone">Phone Number</label>
                <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                  <Phone className="w-4 h-4 text-text-muted" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(""); }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    id="register-phone"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="register-email">Email Address</label>
                <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    id="register-email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="register-password">Password</label>
                <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                  <Lock className="w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    id="register-password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="register-confirm">Confirm Password</label>
                <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                  <Lock className="w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    id="register-confirm"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                id="register-submit"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-text-muted mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
