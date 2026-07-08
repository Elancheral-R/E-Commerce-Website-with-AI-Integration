"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Zap, Eye, EyeOff, User } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate user register + login
    login(
      {
        id: `u-${Date.now()}`,
        email,
        name,
        role: "customer",
        isEmailVerified: false,
        isTwoFactorEnabled: false,
        loyaltyPoints: 0,
        membershipLevel: "bronze",
        createdAt: new Date().toISOString(),
        addresses: [],
      },
      "dummy-jwt-token"
    );
    router.push("/");
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-xs text-danger font-medium">{error}</p>}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase">Full Name</label>
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
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase">Email Address</label>
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
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase">Password</label>
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

              <button type="submit" className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm mt-6">
                Create Account
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-surface px-3 text-xs text-text-muted uppercase font-bold">Or sign up with</span>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-all text-sm font-semibold text-text-secondary">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.922 1 12s4.922 11 11.24 11c6.595 0 11-4.634 11-11.196 0-.756-.08-1.334-.18-1.91H12.24z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-all text-sm font-semibold text-text-secondary">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </button>
            </div>

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
