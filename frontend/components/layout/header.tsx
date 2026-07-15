"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Sparkles,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  LayoutDashboard,
  Zap,
  TrendingUp,
  Command,
  ArrowRight,
  Building2,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useAuthStore } from "@/lib/store/auth";
import { cn, debounce } from "@/lib/utils";
import { popularSearches, mockProducts } from "@/lib/mock-data";
import { BecomeSellerModal } from "@/components/seller/become-seller-modal";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [becomeSellerOpen, setBecomeSellerOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { itemCount, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClose = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener("click", handleClose);
      return () => document.removeEventListener("click", handleClose);
    }
  }, [userMenuOpen]);

  const handleSearch = debounce((query: string) => {
    if (query.length < 2) { setSearchResults([]); return; }
    const results = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results.slice(0, 6));
  }, 280);

  const count = mounted ? itemCount() : 0;
  const visibleNavLinks = navLinks.filter(link => {
    if (link.href === "/sellers") {
      return isAuthenticated && user?.role === "admin";
    }
    return true;
  });

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}>
        {/* Announcement Bar */}
        <div className="bg-slate-900 text-white text-center py-2 text-xs font-medium tracking-wide">
          ✨ Free shipping on orders above ₹999 &nbsp;·&nbsp; Use{" "}
          <span className="font-bold bg-white/10 px-2 py-0.5 rounded">NEXMART50</span>
          {" "}for 50% off &nbsp;·&nbsp; AI-powered recommendations now live
        </div>

        {/* Nav wrapper */}
        <div className="py-3 px-4 md:px-8">
          <nav className="mx-auto max-w-[1400px]">
            <div className="flex items-center gap-3 h-14">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                <div className="relative w-8.5 h-8.5">
                  <div className="w-8.5 h-8.5 rounded-lg bg-primary flex items-center justify-center transition-all duration-200">
                    <Zap className="w-4.5 h-4.5 text-white fill-white" />
                  </div>
                </div>
                <span className="font-display font-bold text-lg text-text-primary hidden sm:block">
                  NexMart
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-1 ml-4">
                {visibleNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-all duration-150 group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
                    </span>
                    {link.badge && (
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide",
                        link.badge === "AI"
                          ? "bg-primary text-white"
                          : "bg-danger/10 text-danger border border-danger/15"
                      )}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Search Trigger */}
              <div ref={searchRef} className="flex-1 max-w-md mx-4 hidden md:block">
                <button
                  onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2 rounded-lg border text-sm text-text-muted transition-all duration-200",
                    searchOpen
                      ? "hidden"
                      : "bg-surface-2 border-border hover:border-primary/45 hover:bg-surface"
                  )}
                >
                  <Search className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left text-xs">Search products...</span>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-3 border border-border">
                    <Command className="w-2.5 h-2.5" />
                    <span className="text-[10px] font-bold">K</span>
                  </div>
                </button>

                {/* Expanded Search */}
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-4 right-4 top-full mt-2 bg-surface rounded-xl border border-border shadow-xl overflow-hidden z-50 md:relative md:top-auto md:left-auto md:right-auto md:mt-0 md:shadow-none"
                    >
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border">
                        <Search className="w-4 h-4 text-primary flex-shrink-0" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search products, brands, categories..."
                          className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearch(e.target.value);
                          }}
                        />
                        {searchQuery && (
                          <button onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="text-text-muted hover:text-text-primary">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setSearchOpen(false)} className="text-text-muted hover:text-text-primary">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="p-2 max-h-72 overflow-y-auto">
                          <p className="text-[10px] text-text-muted px-3 py-1.5 font-bold uppercase tracking-widest">Products</p>
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors group"
                              onClick={() => setSearchOpen(false)}
                            >
                              <div className="w-11 h-11 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0 ring-1 ring-border">
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">{product.name}</p>
                                <p className="text-xs text-text-muted">{product.brand} · ₹{product.price.toLocaleString("en-IN")}</p>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4">
                          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> Trending
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {popularSearches.map((s) => (
                              <button
                                key={s}
                                onClick={() => { setSearchQuery(s); handleSearch(s); }}
                                className="text-xs px-3 py-1.5 rounded-full bg-surface-2 hover:bg-primary/10 hover:text-primary text-text-secondary border border-border hover:border-primary/30 transition-all"
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
              <div className="flex items-center gap-1 ml-auto">
                {/* AI Search */}
                <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/8 border border-primary/15 hover:bg-primary/12 transition-all">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden lg:block">AI Search</span>
                </button>

                {/* Become a Seller */}
                {(!isAuthenticated || user?.role === "customer") && (
                  <button
                    onClick={() => setBecomeSellerOpen(true)}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-surface-2 hover:bg-surface-3 border border-border hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Become a Seller</span>
                  </button>
                )}

                {/* Theme Toggle */}
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
                    title="Toggle theme"
                  >
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: 0, scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                    >
                      {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
                    </motion.div>
                  </button>
                )}

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="relative p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all hidden sm:flex"
                >
                  <Heart className="w-4.5 h-4.5" />
                  <AnimatePresence>
                    {wishlistItems.length > 0 && (
                      <motion.span
                        key={wishlistItems.length}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger text-white text-[9px] font-black rounded-full flex items-center justify-center"
                      >
                        {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all hidden sm:flex">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-live-dot" />
                </button>

                {/* Cart */}
                <button
                  onClick={openCart}
                  className="relative p-2.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        key={count}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 600, damping: 18 }}
                        className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                      >
                        {count > 99 ? "99+" : count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* User Menu */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-surface-2 transition-all ml-1"
                  >
                    <div className="w-7.5 h-7.5 w-[30px] h-[30px] rounded-full overflow-hidden bg-primary flex items-center justify-center ring-2 ring-primary/20">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <ChevronDown className={cn("w-3 h-3 text-text-muted transition-transform duration-200 hidden sm:block", userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute right-0 top-full mt-2 w-60 bg-surface rounded-xl border border-border shadow-lg overflow-hidden z-50"
                      >
                        {isAuthenticated && user ? (
                          <>
                            <div className="p-4 border-b border-border">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex-shrink-0 flex items-center justify-center">
                                  {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                  <p className="font-bold text-text-primary text-sm">{user.name}</p>
                                  <p className="text-text-muted text-xs truncate">{user.email}</p>
                                </div>
                              </div>
                              <span className={cn("badge text-[10px]",
                                user.membershipLevel === "gold" || user.membershipLevel === "platinum"
                                  ? "badge-warning" : "badge-primary"
                              )}>
                                ⭐ {user.membershipLevel.charAt(0).toUpperCase() + user.membershipLevel.slice(1)} Member
                              </span>
                            </div>
                            <div className="p-2">
                              {[
                                { href: "/profile", icon: User, label: "My Profile" },
                                { href: "/orders", icon: Package, label: "My Orders" },
                                { href: "/profile/settings", icon: Settings, label: "Settings" },
                                ...(user.role === "seller" ? [{ href: "/seller/dashboard", icon: LayoutDashboard, label: "Seller Dashboard" }] : []),
                                ...(user.role === "admin" ? [{ href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Panel" }] : []),
                                ...(user.role === "customer" ? [{ action: "become-seller", icon: Building2, label: "Become a Seller" }] : []),
                              ].map((item) => {
                                if ("action" in item) {
                                  return (
                                    <button
                                      key={item.label}
                                      onClick={() => {
                                        if (item.action === "become-seller") setBecomeSellerOpen(true);
                                        setUserMenuOpen(false);
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 text-sm text-text-secondary hover:text-text-primary transition-all group text-left cursor-pointer"
                                    >
                                      <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                                      {item.label}
                                    </button>
                                  );
                                }
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 text-sm text-text-secondary hover:text-text-primary transition-all group"
                                    onClick={() => setUserMenuOpen(false)}
                                  >
                                    <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                                    {item.label}
                                  </Link>
                                );
                              })}
                              <button
                                onClick={() => { logout(); setUserMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-danger/8 text-sm text-danger transition-all mt-1 border-t border-border/50 pt-3"
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
                              className="block w-full text-center btn-primary py-2.5 text-sm rounded-xl"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/auth/register"
                              className="block w-full text-center py-2.5 rounded-xl text-sm border border-border hover:border-primary/30 hover:bg-primary/5 text-text-secondary transition-all"
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
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mobileOpen ? "x" : "menu"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu — Bottom Sheet Style */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface border-t border-border rounded-t-3xl shadow-xl"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Mobile Search */}
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-2 border border-border">
                  <Search className="w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                  />
                  <Mic className="w-4 h-4 text-text-muted" />
                </div>
              </div>

              <nav className="px-4 space-y-1 pb-2">
                {visibleNavLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="font-semibold">{link.label}</span>
                      <div className="flex items-center gap-2">
                        {link.badge && (
                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded-full font-bold",
                            link.badge === "AI"
                              ? "bg-primary text-white"
                              : "bg-danger/10 text-danger border border-danger/15"
                          )}>
                            {link.badge}
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {(!isAuthenticated || user?.role === "customer") && (
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: visibleNavLinks.length * 0.04 }}
                  >
                    <button
                      onClick={() => { setBecomeSellerOpen(true); setMobileOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-surface-2 text-text-secondary hover:text-text-primary transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-text-muted" />
                        <span className="font-semibold">Become a Seller</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                    </button>
                  </motion.div>
                )}
              </nav>

              <div className="px-4 pb-3 pt-2 border-t border-border grid grid-cols-3 gap-2">
                {[
                  { href: "/wishlist", icon: Heart, label: "Wishlist" },
                  { href: "/profile", icon: User, label: "Profile" },
                  { href: "/orders", icon: Package, label: "Orders" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-surface-2 text-text-secondary transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Safe area spacer */}
              <div className="h-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BecomeSellerModal isOpen={becomeSellerOpen} onClose={() => setBecomeSellerOpen(false)} />
    </>
  );
}
