"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { SellerSidebar } from "@/components/seller/seller-sidebar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace("/auth/login?redirectTo=/seller/dashboard");
    } else if (user?.role !== "seller" && user?.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, user, router, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-text-muted text-xs font-semibold">Loading Seller Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "seller" && user?.role !== "admin")) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SellerSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main className="flex-1 overflow-y-auto bg-background relative">
        {children}
      </main>
    </div>
  );
}
