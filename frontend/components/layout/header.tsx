"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Mic,
  Camera,
  Sparkles,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
  Zap,
  TrendingUp,
  Command,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useAuthStore } from "@/lib/store/auth";
import { useUIStore } from "@/lib/store/ui";
import { cn, debounce } from "@/lib/utils";
import { popularSearches, mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Flash Sales", href: "/flash-sales", badge: "🔥" },
  { label: "Categories", href: "/categories" },
  { label: "AI Assistant", href: "/ai-assistant", badge: "AI" },
  { label: "Sellers", href: "/sellers" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { itemCount, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = debounce((query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results.slice(0, 5));
  }, 300);

  const count = mounted ? itemCount() : 0;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-dark border-b border-white/5 shadow-xl"
          : "bg-transparent"
      )}
    >
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary animate-gradient text-white text-center py-1.5 text-sm font-medium">
        🎉 Free shipping on orders above ₹999 · Use code{" "}
        <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">NEXMART50</span> for 50% off
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">
              NexMart
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all duration-150"
              >
                {link.label}
                {link.badge && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      link.badge === "AI"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-danger/20 text-danger"
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl mx-4 relative">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2.5 transition-all duration-200",
                searchFocused
                  ? "bg-surface border-primary shadow-[0_0_0_3px_rgb(99_102_241/0.15)]"
                  : "bg-surface-2 border-border hover:border-primary/50"
              )}
            >
              <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                onFocus={() => setSearchFocused(true)}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setSearchResults([]); }}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
                <button className="p-1 text-text-muted hover:text-primary transition-colors" title="Voice search">
                  <Mic className="w-4 h-4" />
                </button>
                <button className="p-1 text-text-muted hover:text-primary transition-colors" title="Image search">
                  <Camera className="w-4 h-4" />
                </button>
                <button className="p-1 text-primary" title="AI search">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl border border-border overflow-hidden z-50 shadow-2xl"
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <p className="text-xs text-text-muted px-3 py-1 font-medium uppercase tracking-wider">Products</p>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors group"
                          onClick={() => setSearchFocused(false)}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-text-muted">₹{product.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-3">
                        <TrendingUp className="w-3 h-3 inline mr-1" /> Popular Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((s) => (
                          <button
                            key={s}
                            onClick={() => { setSearchQuery(s); handleSearch(s); }}
                            className="text-sm px-3 py-1.5 rounded-full bg-surface-2 hover:bg-primary/20 hover:text-primary text-text-secondary transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all hidden sm:flex"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all hidden sm:flex">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {count > 99 ? "99+" : count}
                </motion.span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-2 transition-all ml-1"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <ChevronDown className={cn("w-3 h-3 text-text-muted transition-transform hidden sm:block", userMenuOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl border border-border shadow-2xl overflow-hidden z-50"
                  >
                    {isAuthenticated && user ? (
                      <>
                        <div className="p-4 border-b border-border">
                          <p className="font-semibold text-text-primary text-sm">{user.name}</p>
                          <p className="text-text-muted text-xs truncate">{user.email}</p>
                          <span className={cn(
                            "badge mt-2",
                            user.membershipLevel === "gold" || user.membershipLevel === "platinum"
                              ? "badge-warning"
                              : "badge-primary"
                          )}>
                            ⭐ {user.membershipLevel.charAt(0).toUpperCase() + user.membershipLevel.slice(1)}
                          </span>
                        </div>
                        <div className="p-2">
                          {[
                            { href: "/profile", icon: User, label: "My Profile" },
                            { href: "/orders", icon: Package, label: "My Orders" },
                            { href: "/profile/settings", icon: Settings, label: "Settings" },
                            ...(user.role === "seller" ? [{ href: "/seller/dashboard", icon: LayoutDashboard, label: "Seller Dashboard" }] : []),
                            ...(user.role === "admin" ? [{ href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Panel" }] : []),
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 text-sm text-text-secondary hover:text-text-primary transition-all"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          ))}
                          <button
                            onClick={() => { logout(); setUserMenuOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-danger/10 text-sm text-danger transition-all mt-1"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 space-y-2">
                        <Link
                          href="/auth/login"
                          className="block w-full text-center btn-primary py-2 rounded-xl text-sm"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block w-full text-center py-2 rounded-xl text-sm border border-border hover:bg-surface-2 text-text-secondary transition-all"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all lg:hidden ml-1"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-dark border-t border-white/5 overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="font-medium">{link.label}</span>
                  {link.badge && (
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold",
                      link.badge === "AI"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-danger/20 text-danger"
                    )}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="pt-2 border-t border-border mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/wishlist"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-surface-2 text-text-secondary transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-surface-2 text-text-secondary transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
