"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Zap, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const { loginWithCredentials, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    const result = await loginWithCredentials(email, password);
    if (result.success) {
      // Admin gets redirected to dashboard
      const store = useAuthStore.getState();
      if (store.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectTo);
      }
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const fillAdmin = () => {
    setEmail("admin@nexmart.com");
    setPassword("admin123");
    setError("");
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
              <h1 className="font-display font-bold text-2xl text-text-primary">Welcome back</h1>
              <p className="text-text-muted text-sm">Enter your credentials to access your account</p>
            </div>

            {/* Admin Quick Login */}
            <button
              type="button"
              onClick={fillAdmin}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all text-left group"
            >
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-primary">Admin Quick Login</p>
                <p className="text-xs text-text-muted">admin@nexmart.com · admin123</p>
              </div>
              <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

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
                <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="login-email">Email Address</label>
                <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    id="login-email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-secondary uppercase" htmlFor="login-password">Password</label>
                  <a href="#" className="text-xs text-primary hover:underline font-semibold">Forgot password?</a>
                </div>
                <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3.5 py-2.5 focus-within:border-primary transition-all">
                  <Lock className="w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none"
                    id="login-password"
                    autoComplete="current-password"
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

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm mt-6 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                id="login-submit"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Register link */}
            <p className="text-center text-sm text-text-muted mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline font-semibold">
                Sign Up
              </Link>
            </p>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginPageContent />
    </Suspense>
  );
}
