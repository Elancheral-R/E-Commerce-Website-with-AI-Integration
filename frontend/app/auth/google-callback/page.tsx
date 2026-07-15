"use client";

/**
 * This page handles the post-OAuth redirect.
 * After Google signs the user in via NextAuth, they land here.
 * We read the NextAuth session and sync it into the Zustand auth store
 * so the rest of the app (middleware cookies, user state) works correctly.
 */

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { Zap } from "lucide-react";
import { Suspense } from "react";
import type { User } from "@/types";

function GoogleCallbackContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("callbackUrl") || "/";
  const { login } = useAuthStore();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (status === "loading" || synced) return;

    if (status === "authenticated" && session?.user) {
      // Build a User object from the NextAuth session
      const googleUser: User = {
        id: (session.user as { id?: string }).id || `google-${Date.now()}`,
        email: session.user.email || "",
        name: session.user.name || "",
        role: ((session.user as { role?: string }).role as User["role"]) || "customer",
        membershipLevel: "bronze",
        loyaltyPoints: 0,
        isEmailVerified: true,
        isTwoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        addresses: [],
        avatar: (session.user as { avatarUrl?: string }).avatarUrl || session.user.image || "",
      };

      // Sync into Zustand store (sets cookies for middleware too)
      login(googleUser, "google-oauth-session");
      setSynced(true);

      // Redirect
      const finalRedirect = redirectTo.startsWith("/auth") ? "/" : redirectTo;
      router.replace(finalRedirect);
    } else if (status === "unauthenticated") {
      router.replace("/auth/login?error=OAuthSignin");
    }
  }, [status, session, synced, login, router, redirectTo]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse glow-primary">
          <Zap className="w-7 h-7 text-white fill-white" />
        </div>
        <p className="text-text-muted text-sm font-medium">Signing you in with Google…</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
