"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Zap, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth";

// ─── Google G Logo SVG ────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const { loginWithCredentials, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      // NextAuth will redirect to Google, then back to /auth/google-callback
      await signIn("google", {
        callbackUrl: `/auth/google-callback?callbackUrl=${encodeURIComponent(redirectTo)}`,
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
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

            {/* Google Sign-In Button */}
            <motion.button
              type="button"
              id="login-google"
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
              <span className="text-xs text-text-muted font-medium">or sign in with email</span>
              <div className="flex-1 h-px bg-border" />
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
                disabled={isLoading || googleLoading}
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
