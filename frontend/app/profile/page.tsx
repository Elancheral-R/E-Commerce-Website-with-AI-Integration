"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Package, Heart, Settings,
  Crown, Star, Shield, LogOut, ChevronRight, Calendar
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuthStore } from "@/lib/store/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirectTo=/profile");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const memberBadge =
    user.membershipLevel === "platinum"
      ? "badge-warning"
      : user.membershipLevel === "gold"
      ? "badge-warning"
      : "badge-primary";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const quickLinks = [
    { href: "/orders", icon: Package, label: "My Orders", desc: "Track & manage your orders" },
    { href: "/wishlist", icon: Heart, label: "Wishlist", desc: "Items you love" },
    { href: "/profile/settings", icon: Settings, label: "Account Settings", desc: "Update profile & password" },
    ...(user.role === "admin" ? [{ href: "/admin/dashboard", icon: Shield, label: "Admin Panel", desc: "Manage the platform" }] : []),
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl border border-border bg-surface p-8 mb-6 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold shadow-lg glow-primary flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="font-display font-bold text-2xl text-text-primary">{user.name}</h1>
                  <span className={`badge text-xs ${memberBadge}`}>
                    ⭐ {user.membershipLevel.charAt(0).toUpperCase() + user.membershipLevel.slice(1)} Member
                  </span>
                  {user.role === "admin" && (
                    <span className="badge badge-warning text-xs">🛡 Admin</span>
                  )}
                </div>
                <p className="text-text-muted text-sm flex items-center gap-1.5 mb-3">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                {user.phone && (
                  <p className="text-text-muted text-sm flex items-center gap-1.5 mb-3">
                    <Phone className="w-3.5 h-3.5" /> {user.phone}
                  </p>
                )}
                <p className="text-text-muted text-xs flex items-center gap-1.5" suppressHydrationWarning>
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Loyalty Points */}
              <div className="text-center glass-card rounded-2xl border border-border p-4 bg-surface-2 min-w-[120px]">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Points</span>
                </div>
                <p className="font-display font-black text-2xl gradient-text">{user.loyaltyPoints.toLocaleString()}</p>
                <p className="text-[10px] text-text-muted mt-1">Loyalty Points</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {quickLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    className="glass-card rounded-2xl border border-border bg-surface hover:bg-surface-2 p-5 flex items-center gap-4 group transition-all hover:border-primary/30"
                    id={`profile-link-${link.href.replace(/\//g, "-")}`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-primary text-sm">{link.label}</p>
                      <p className="text-xs text-text-muted">{link.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Addresses Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl border border-border bg-surface p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Saved Addresses
              </h2>
              <button className="text-xs font-semibold text-primary hover:underline">+ Add Address</button>
            </div>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl bg-surface-2 border border-border text-sm">
                    <p className="font-bold text-text-primary mb-1">{addr.fullName} {addr.isDefault && <span className="badge badge-primary text-[9px] ml-1">Default</span>}</p>
                    <p className="text-text-muted text-xs">{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                    <p className="text-text-muted text-xs">{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p className="text-text-muted text-xs">{addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-text-muted text-sm">No saved addresses yet.</p>
                <button className="text-xs text-primary font-semibold mt-2 hover:underline">Add your first address</button>
              </div>
            )}
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <button
              onClick={handleLogout}
              id="profile-logout-btn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-danger/30 text-danger hover:bg-danger/8 transition-all text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  );
}
