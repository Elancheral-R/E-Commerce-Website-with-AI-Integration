"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Users, ShieldAlert, Sparkles, TrendingUp,
  AlertTriangle, DollarSign, Package, Settings, LogOut, ChevronRight,
  Eye, RefreshCw, BarChart2, Star, CheckCircle, XCircle, Search, Edit, Trash2,
  Plus, Shield, Check
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { mockRevenueData, mockProducts, mockCategories } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const adminStats = [
  { label: "Daily Revenue", value: 1245900, change: 18.2, icon: DollarSign, prefix: "₹" },
  { label: "Monthly Revenue", value: 37280000, change: 14.5, icon: BarChart2, prefix: "₹" },
  { label: "Live Visitors", value: 8420, change: 32.8, icon: Users, suffix: " active" },
  { label: "Orders / Min", value: 48, change: 5.4, icon: ShoppingBag },
];

const fraudAlerts = [
  { id: "fa1", user: "Vikram Malhotra", email: "vikram@example.com", reason: "Multiple checkout failures + coupon abuse", score: 92, status: "critical" },
  { id: "fa2", user: "Sneha Reddy", email: "sneha.r@example.com", reason: "IP address mismatch + high value order", score: 78, status: "warning" },
  { id: "fa3", user: "Bot Account #8942", email: "bot8942@botnet.org", reason: "Scripted click behavior during flash sale", score: 98, status: "critical" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "fraud" | "inventory" | "sellers" | "create-product" | "flash-sales" | "categories">("overview");

  // Local state for dynamically loaded tables
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  // Search filter states
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Role Gate check
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login?redirectTo=/admin/dashboard");
    } else if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, user, router]);

  // Load User, Product & Category list
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["overview", "users", "fraud", "inventory", "sellers", "create-product", "flash-sales", "categories"].includes(tab)) {
        setActiveTab(tab as any);
      }

      // 1. Get users from our new localStorage DB
      const localUsersRaw = localStorage.getItem("nexmart-users-db");
      if (localUsersRaw) {
        setLocalUsers(JSON.parse(localUsersRaw));
      } else {
        // Seed default fallback array
        const seeded = [
          { id: "admin-001", email: "admin@nexmart.com", name: "System Admin", role: "admin", membershipLevel: "platinum", loyaltyPoints: 9999, createdAt: new Date().toISOString() },
          { id: "u-1", email: "vikram@example.com", name: "Vikram Malhotra", role: "customer", membershipLevel: "gold", loyaltyPoints: 540, createdAt: new Date().toISOString() },
          { id: "u-2", email: "sneha.r@example.com", name: "Sneha Reddy", role: "customer", membershipLevel: "silver", loyaltyPoints: 210, createdAt: new Date().toISOString() },
          { id: "u-3", email: "rajesh.patel@domain.com", name: "Rajesh Patel", role: "seller", membershipLevel: "bronze", loyaltyPoints: 0, createdAt: new Date().toISOString() }
        ];
        localStorage.setItem("nexmart-users-db", JSON.stringify(seeded));
        setLocalUsers(seeded);
      }

      // 2. Load products
      const storedProds = localStorage.getItem("nexmart-products");
      if (storedProds) {
        setLocalProducts(JSON.parse(storedProds));
      } else {
        localStorage.setItem("nexmart-products", JSON.stringify(mockProducts));
        setLocalProducts(mockProducts);
      }

      // 3. Load categories
      const storedCats = localStorage.getItem("nexmart-categories");
      if (storedCats) {
        setLocalCategories(JSON.parse(storedCats));
      } else {
        localStorage.setItem("nexmart-categories", JSON.stringify(mockCategories));
        setLocalCategories(mockCategories);
      }
    }
  }, []);

  // Category creation form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "📦",
    color: "#6366f1",
    image: ""
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      alert("Please enter a category name.");
      return;
    }
    const newCat = {
      id: "cat-" + Date.now(),
      name: categoryForm.name,
      slug: categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: categoryForm.icon,
      color: categoryForm.color,
      image: categoryForm.image || "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&q=80",
      productCount: 0
    };
    const updated = [...localCategories, newCat];
    setLocalCategories(updated);
    localStorage.setItem("nexmart-categories", JSON.stringify(updated));
    setCategoryForm({ name: "", icon: "📦", color: "#6366f1", image: "" });
    alert("Category created successfully!");
  };

  const handleDeleteCategory = (id: string) => {
    const updated = localCategories.filter(c => c.id !== id);
    setLocalCategories(updated);
    localStorage.setItem("nexmart-categories", JSON.stringify(updated));
    alert("Category deleted successfully!");
  };

  // Product creation form state in admin
  const [adminProductForm, setAdminProductForm] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "electronics",
    image: "",
    sku: "",
    description: ""
  });

  const handleApproveProduct = (id: string) => {
    const updated = localProducts.map(p => p.id === id ? { ...p, approved: true } : p);
    setLocalProducts(updated);
    localStorage.setItem("nexmart-products", JSON.stringify(updated));
    alert("Product approved successfully!");
  };

  const handleRejectProduct = (id: string) => {
    const updated = localProducts.filter(p => p.id !== id);
    setLocalProducts(updated);
    localStorage.setItem("nexmart-products", JSON.stringify(updated));
    alert("Product rejected and deleted.");
  };

  const handleToggleFlashSale = (id: string, currentStatus: boolean) => {
    const updated = localProducts.map(p => p.id === id ? { ...p, isFlashSale: !currentStatus } : p);
    setLocalProducts(updated);
    localStorage.setItem("nexmart-products", JSON.stringify(updated));
  };

  const handleUpdateFlashDiscount = (id: string, discountPct: number) => {
    const updated = localProducts.map(p => {
      if (p.id === id) {
        const disc = isNaN(discountPct) ? 0 : discountPct;
        const newPrice = Math.round(p.originalPrice * (1 - disc / 100));
        return { ...p, discount: disc, price: newPrice, isFlashSale: true };
      }
      return p;
    });
    setLocalProducts(updated);
    localStorage.setItem("nexmart-products", JSON.stringify(updated));
  };

  const handleAdminProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProductForm.name || !adminProductForm.price || !adminProductForm.brand || !adminProductForm.stock) {
      alert("Please fill in all required fields.");
      return;
    }
    const priceVal = parseFloat(adminProductForm.price);
    const origPriceVal = adminProductForm.originalPrice ? parseFloat(adminProductForm.originalPrice) : priceVal;

    const newProd = {
      id: "p-admin-" + Date.now(),
      slug: adminProductForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: adminProductForm.name,
      price: priceVal,
      originalPrice: origPriceVal,
      discount: Math.round(((origPriceVal - priceVal) / origPriceVal) * 100),
      currency: "INR",
      images: [
        adminProductForm.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=90"
      ],
      category: {
        id: String(Math.floor(Math.random() * 8) + 1),
        name: adminProductForm.category.charAt(0).toUpperCase() + adminProductForm.category.slice(1).replace("-", " & "),
        slug: adminProductForm.category
      },
      brand: adminProductForm.brand,
      seller: {
        id: "admin-001",
        name: "System Admin",
        logo: "https://api.dicebear.com/7.x/shapes/svg?seed=admin",
        rating: 5.0,
        verified: true,
        totalSales: 9999,
        joinedAt: "2024-01-01"
      },
      rating: 5.0,
      reviewCount: 0,
      stock: parseInt(adminProductForm.stock),
      sku: adminProductForm.sku || "SKU-" + Date.now(),
      description: adminProductForm.description || "Premium quality product.",
      tags: [adminProductForm.category, adminProductForm.brand.toLowerCase()],
      isFeatured: false,
      isFlashSale: false,
      isBestSeller: false,
      isNew: true,
      approved: true,
      createdAt: new Date().toISOString()
    };

    const updated = [...localProducts, newProd];
    setLocalProducts(updated);
    localStorage.setItem("nexmart-products", JSON.stringify(updated));

    alert("Product published successfully! Added to customer catalog.");
    setAdminProductForm({
      name: "",
      brand: "",
      price: "",
      originalPrice: "",
      stock: "",
      category: "electronics",
      image: "",
      sku: "",
      description: ""
    });
    setActiveTab("inventory");
  };

  if (!isAuthenticated || user?.role !== "admin") return null;

  // Handle deleting a user
  const handleDeleteUser = (id: string) => {
    const updated = localUsers.filter((u) => u.id !== id);
    setLocalUsers(updated);
    localStorage.setItem("nexmart-users-db", JSON.stringify(updated));
  };

  // Handle changing user role
  const handleToggleRole = (id: string, currentRole: string) => {
    const nextRole = currentRole === "admin" ? "customer" : currentRole === "customer" ? "seller" : "admin";
    const updated = localUsers.map((u) => u.id === id ? { ...u, role: nextRole } : u);
    setLocalUsers(updated);
    localStorage.setItem("nexmart-users-db", JSON.stringify(updated));
  };

  // Filtered lists
  const filteredUsers = localUsers.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = localProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16 flex">
        
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-[calc(100vh-6rem)] sticky top-24">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-sm">{user.name}</h3>
                <span className="badge badge-primary text-[10px] py-0 mt-1">Super Admin</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
              { id: "users" as const, label: "User Management", icon: Users },
              { id: "sellers" as const, label: "Seller & Product Approvals", icon: Shield },
              { id: "categories" as const, label: "Categories Manager", icon: Settings },
              { id: "create-product" as const, label: "WordPress-like Creator", icon: Plus },
              { id: "flash-sales" as const, label: "Flash Sales Control", icon: Sparkles },
              { id: "fraud" as const, label: "AI Fraud Alerts", icon: ShieldAlert },
              { id: "inventory" as const, label: "Inventory Health", icon: Package },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/15 text-primary"
                    : "text-text-secondary hover:bg-surface-2"
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:bg-surface-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Exit Panel
            </Link>
          </div>
        </aside>

        {/* Admin Main Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1200px]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-text-primary">Admin Control Center</h1>
              <p className="text-text-muted mt-1">Global platform metrics, AI security monitoring, and operations.</p>
            </div>
            <button className="px-4 py-2.5 rounded-xl bg-surface border border-border text-sm text-text-secondary hover:text-text-primary flex items-center gap-2 transition-all">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {adminStats.map((s) => (
                      <div key={s.label} className="stat-card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{s.label}</span>
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <s.icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <p className="font-display font-bold text-2xl text-text-primary">
                            {s.prefix}{s.value.toLocaleString()}{s.suffix}
                          </p>
                          {s.change > 0 && (
                            <span className="text-xs font-bold text-success">+{s.change}%</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Line Chart */}
                  <div className="glass-card rounded-3xl border border-border p-6 bg-surface">
                    <h3 className="font-display font-bold text-lg text-text-primary mb-6">Platform Transaction Value (Daily)</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                          <Tooltip contentStyle={{ background: "#111118", border: "1px solid #1f1f2e" }} />
                          <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick AI Security Warning panel */}
                  <div className="p-5 rounded-2xl bg-danger/10 border border-danger/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="w-6 h-6 text-danger mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-text-primary text-sm">Critical Security Alert</p>
                        <p className="text-text-muted text-xs">Our AI Fraud system detected suspicious automated coupon abuse from 3 IPs.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("fraud")}
                      className="px-4 py-2 bg-danger text-white rounded-xl text-xs font-bold hover:bg-danger-dark transition-all whitespace-nowrap"
                    >
                      Inspect Alert
                    </button>
                  </div>
                </div>
              )}

              {/* AI Fraud Alerts Tab */}
              {activeTab === "fraud" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-danger" />
                    <h2 className="font-display font-bold text-xl text-text-primary">AI Fraud Detection Panel</h2>
                  </div>

                  <div className="grid gap-4">
                    {fraudAlerts.map((alert) => (
                      <div key={alert.id} className="glass-card rounded-2xl border border-border p-6 bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-text-primary text-base">{alert.user}</p>
                            <span className="text-xs text-text-muted">{alert.email}</span>
                          </div>
                          <p className="text-sm text-text-secondary">{alert.reason}</p>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className="text-xs text-text-muted block">Risk Score</span>
                            <span className={`font-bold text-lg ${alert.score > 85 ? "text-danger" : "text-warning"}`}>
                              {alert.score}% Risk
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 rounded-xl bg-success/10 text-success hover:bg-success hover:text-white transition-all">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic User Management Table */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-display font-bold text-xl text-text-primary flex items-center gap-2">
                      <Users className="w-6 h-6 text-primary" /> Active User Directory
                    </h2>
                    
                    {/* Search Bar */}
                    <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3 py-2 text-xs">
                      <Search className="w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        placeholder="Search name, email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="bg-transparent outline-none text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl border border-border bg-surface overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-surface-2 text-text-muted font-bold uppercase tracking-wider">
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Tier</th>
                            <th className="p-4">Loyalty Points</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-surface-2/40 transition-colors">
                              <td className="p-4">
                                <p className="font-bold text-text-primary">{u.name}</p>
                                <p className="text-text-muted text-[10px]">{u.email}</p>
                              </td>
                              <td className="p-4 capitalize">
                                <span className={`badge text-[10px] ${u.role === "admin" ? "badge-warning" : u.role === "seller" ? "badge-primary" : "bg-surface-3 text-text-secondary"}`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-4 capitalize">{u.membershipLevel || "Bronze"}</td>
                              <td className="p-4">{(u.loyaltyPoints || 0).toLocaleString()}</td>
                              <td className="p-4 text-right flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleRole(u.id, u.role)}
                                  className="px-2 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                                  title="Cycle user role"
                                >
                                  Change Role
                                </button>
                                {u.email !== "admin@nexmart.com" && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1.5 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-lg transition-all"
                                    title="Delete account"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                          {filteredUsers.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-text-muted">No users matching search filters.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Inventory / Product Table */}
              {activeTab === "inventory" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-display font-bold text-xl text-text-primary flex items-center gap-2">
                      <Package className="w-6 h-6 text-primary" /> System Product Inventory
                    </h2>
                    
                    {/* Search Bar */}
                    <div className="flex items-center gap-2 bg-surface-2 rounded-xl border border-border px-3 py-2 text-xs">
                      <Search className="w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        placeholder="Search product, brand..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="bg-transparent outline-none text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl border border-border bg-surface overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-surface-2 text-text-muted font-bold uppercase tracking-wider">
                            <th className="p-4">Product Name</th>
                            <th className="p-4">SKU / Code</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock Status</th>
                            <th className="p-4">Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-surface-2/40 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-text-primary">{p.name}</p>
                                    <p className="text-text-muted text-[10px]">{p.brand} · {p.category.name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-mono text-[10px]">{p.sku}</td>
                              <td className="p-4 font-bold">{formatCurrency(p.price)}</td>
                              <td className="p-4">
                                <span className={`badge text-[10px] ${p.stock > 10 ? "badge-primary" : p.stock > 0 ? "badge-warning" : "badge-danger"}`}>
                                  {p.stock > 0 ? `${p.stock} units` : "Out of Stock"}
                                </span>
                              </td>
                              <td className="p-4 flex items-center gap-1 font-semibold text-text-primary">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                {p.rating}
                              </td>
                            </tr>
                          ))}
                          {filteredProducts.length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-text-muted">No products matching search filters.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {/* ── Seller & Product Approvals Tab ── */}
              {activeTab === "sellers" && (() => {
                const pendingProducts = localProducts.filter((p) => !p.approved);
                const approvedSellerProducts = localProducts.filter((p) => p.approved && p.seller?.id !== "admin-001");
                const sellers = localUsers.filter((u) => u.role === "seller");
                return (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-primary" />
                      <h2 className="font-display font-bold text-xl text-text-primary">Seller &amp; Product Approvals</h2>
                      {pendingProducts.length > 0 && (
                        <span className="badge badge-warning text-[10px]">{pendingProducts.length} Pending</span>
                      )}
                    </div>

                    {/* Registered Sellers */}
                    <div className="glass-card rounded-2xl border border-border bg-surface overflow-hidden">
                      <div className="p-5 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" /> Registered Sellers ({sellers.length})
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-surface-2 text-text-muted font-bold uppercase tracking-wider">
                              <th className="p-4">Seller</th>
                              <th className="p-4">Products Listed</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {sellers.length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-text-muted">No sellers registered yet.</td>
                              </tr>
                            )}
                            {sellers.map((s) => {
                              const productCount = localProducts.filter((p) => p.seller?.id === s.id).length;
                              return (
                                <tr key={s.id} className="hover:bg-surface-2/40 transition-colors">
                                  <td className="p-4">
                                    <p className="font-bold text-text-primary">{s.name}</p>
                                    <p className="text-text-muted text-[10px]">{s.email}</p>
                                  </td>
                                  <td className="p-4">
                                    <span className="font-semibold text-text-primary">{productCount}</span>
                                    <span className="text-text-muted ml-1">products</span>
                                  </td>
                                  <td className="p-4">
                                    <span className="badge badge-primary text-[10px]">Active Seller</span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button
                                      onClick={() => handleToggleRole(s.id, s.role)}
                                      className="px-2 py-1 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-lg transition-all text-[10px] font-bold"
                                    >
                                      Revoke Seller Access
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pending Product Approvals */}
                    <div className="glass-card rounded-2xl border border-border bg-surface overflow-hidden">
                      <div className="p-5 border-b border-border">
                        <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" /> Pending Product Approvals
                        </h3>
                        <p className="text-text-muted text-[11px] mt-1">Review products submitted by sellers before they go live to customers.</p>
                      </div>

                      {pendingProducts.length === 0 ? (
                        <div className="p-12 text-center">
                          <CheckCircle className="w-12 h-12 text-success mx-auto mb-3 opacity-60" />
                          <p className="text-text-secondary font-semibold">All caught up!</p>
                          <p className="text-text-muted text-xs mt-1">No products are awaiting approval right now.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/60">
                          {pendingProducts.map((p) => (
                            <div key={p.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-surface-2/30 transition-colors">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                                <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-text-primary text-sm truncate">{p.name}</p>
                                <p className="text-text-muted text-[11px]">
                                  by <span className="text-primary font-semibold">{p.seller?.name || "Unknown Seller"}</span>
                                  &nbsp;·&nbsp;{p.category?.name}&nbsp;·&nbsp;
                                  <span className="font-semibold text-text-secondary">₹{p.price?.toLocaleString("en-IN")}</span>
                                  &nbsp;·&nbsp;Stock: {p.stock}
                                </p>
                                {p.description && (
                                  <p className="text-text-muted text-[11px] mt-1 line-clamp-1">{p.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleApproveProduct(p.id)}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-success/10 text-success hover:bg-success hover:text-white rounded-xl text-xs font-bold transition-all"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button
                                  onClick={() => handleRejectProduct(p.id)}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-xl text-xs font-bold transition-all"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Live Seller Products (approved) */}
                    {approvedSellerProducts.length > 0 && (
                      <div className="glass-card rounded-2xl border border-border bg-surface overflow-hidden">
                        <div className="p-5 border-b border-border">
                          <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                            <Check className="w-4 h-4 text-success" /> Live Seller Products ({approvedSellerProducts.length})
                          </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-surface-2 text-text-muted font-bold uppercase tracking-wider">
                                <th className="p-4">Product</th>
                                <th className="p-4">Seller</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {approvedSellerProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-surface-2/40 transition-colors">
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                                        <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      <p className="font-semibold text-text-primary truncate max-w-[180px]">{p.name}</p>
                                    </div>
                                  </td>
                                  <td className="p-4 text-text-secondary">{p.seller?.name}</td>
                                  <td className="p-4 font-bold">₹{p.price?.toLocaleString("en-IN")}</td>
                                  <td className="p-4">
                                    <span className={`badge text-[10px] ${p.stock > 10 ? "badge-primary" : p.stock > 0 ? "badge-warning" : "badge-danger"}`}>
                                      {p.stock > 0 ? `${p.stock} units` : "Out of Stock"}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button
                                      onClick={() => handleRejectProduct(p.id)}
                                      className="px-2 py-1 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-lg transition-all text-[10px] font-bold"
                                    >
                                      Remove Listing
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── WordPress-like Product Creator Tab ── */}
              {activeTab === "create-product" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <Plus className="w-6 h-6 text-primary" />
                    <div>
                      <h2 className="font-display font-bold text-xl text-text-primary">Product Creator</h2>
                      <p className="text-text-muted text-xs mt-0.5">Publish directly to the customer catalog — no approval required.</p>
                    </div>
                  </div>

                  <form onSubmit={handleAdminProductSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="glass-card rounded-2xl border border-border bg-surface p-6 space-y-5">
                      <h3 className="font-semibold text-text-primary text-sm border-b border-border pb-3">Basic Information</h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Product Name *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Sony WH-1000XM5 Headphones"
                            value={adminProductForm.name}
                            onChange={(e) => setAdminProductForm((f) => ({ ...f, name: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Brand *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Sony"
                            value={adminProductForm.brand}
                            onChange={(e) => setAdminProductForm((f) => ({ ...f, brand: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Category *</label>
                        <select
                          value={adminProductForm.category}
                          onChange={(e) => setAdminProductForm((f) => ({ ...f, category: e.target.value }))}
                          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                        >
                          {["electronics", "fashion", "home-living", "sports", "beauty", "automotive", "books", "toys"].map((cat) => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " & ")}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Product Description</label>
                        <textarea
                          rows={4}
                          placeholder="Describe the product features, specifications, and highlights..."
                          value={adminProductForm.description}
                          onChange={(e) => setAdminProductForm((f) => ({ ...f, description: e.target.value }))}
                          className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                        />
                      </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="glass-card rounded-2xl border border-border bg-surface p-6 space-y-5">
                      <h3 className="font-semibold text-text-primary text-sm border-b border-border pb-3">Pricing &amp; Inventory</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Sale Price (₹) *</label>
                          <input
                            required
                            type="number"
                            min="1"
                            placeholder="e.g. 24999"
                            value={adminProductForm.price}
                            onChange={(e) => setAdminProductForm((f) => ({ ...f, price: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">MRP / Original Price (₹)</label>
                          <input
                            type="number"
                            min="1"
                            placeholder="e.g. 29999"
                            value={adminProductForm.originalPrice}
                            onChange={(e) => setAdminProductForm((f) => ({ ...f, originalPrice: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                          <p className="text-[10px] text-text-muted">Leave blank to match sale price</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Stock Quantity *</label>
                          <input
                            required
                            type="number"
                            min="0"
                            placeholder="e.g. 150"
                            value={adminProductForm.stock}
                            onChange={(e) => setAdminProductForm((f) => ({ ...f, stock: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>

                      {adminProductForm.price && adminProductForm.originalPrice && parseFloat(adminProductForm.originalPrice) > parseFloat(adminProductForm.price) && (
                        <div className="px-4 py-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-semibold">
                          ✓ Discount: {Math.round(((parseFloat(adminProductForm.originalPrice) - parseFloat(adminProductForm.price)) / parseFloat(adminProductForm.originalPrice)) * 100)}% off — will be auto-calculated on publish.
                        </div>
                      )}
                    </div>

                    {/* Media & SKU */}
                    <div className="glass-card rounded-2xl border border-border bg-surface p-6 space-y-5">
                      <h3 className="font-semibold text-text-primary text-sm border-b border-border pb-3">Media &amp; Identifiers</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Product Image URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={adminProductForm.image}
                            onChange={(e) => setAdminProductForm((f) => ({ ...f, image: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                          <p className="text-[10px] text-text-muted">Leave blank for a default placeholder image</p>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">SKU / Product Code</label>
                          <input
                            type="text"
                            placeholder="e.g. SONY-WH1000XM5-BLK"
                            value={adminProductForm.sku}
                            onChange={(e) => setAdminProductForm((f) => ({ ...f, sku: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                          <p className="text-[10px] text-text-muted">Leave blank for auto-generated SKU</p>
                        </div>
                      </div>
                      {adminProductForm.image && (
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-2 border border-border">
                          <img src={adminProductForm.image} alt="preview" className="w-16 h-16 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <p className="text-xs text-text-secondary">Image Preview</p>
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                      <button
                        type="submit"
                        className="btn btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Publish Product
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminProductForm({ name: "", brand: "", price: "", originalPrice: "", stock: "", category: "electronics", image: "", sku: "", description: "" })}
                        className="px-6 py-3 rounded-xl border border-border text-text-secondary hover:text-text-primary text-sm transition-all"
                      >
                        Reset
                      </button>
                      <p className="text-xs text-text-muted">Products published here are instantly live for customers.</p>
                    </div>
                  </form>
                </div>
              )}

              {/* ── Flash Sales Control Tab ── */}
              {activeTab === "flash-sales" && (() => {
                const flashSaleProducts = localProducts.filter((p) => p.isFlashSale);
                const eligibleProducts = localProducts.filter((p) => p.approved);
                return (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-warning" />
                      <div>
                        <h2 className="font-display font-bold text-xl text-text-primary">Flash Sales Control</h2>
                        <p className="text-text-muted text-xs mt-0.5">Toggle flash sale status and set discounts for any approved product.</p>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="stat-card p-5">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Active Flash Sales</p>
                        <p className="font-display font-bold text-3xl text-warning">{flashSaleProducts.length}</p>
                      </div>
                      <div className="stat-card p-5">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Eligible Products</p>
                        <p className="font-display font-bold text-3xl text-text-primary">{eligibleProducts.length}</p>
                      </div>
                      <div className="stat-card p-5 col-span-2 sm:col-span-1">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Avg. Flash Discount</p>
                        <p className="font-display font-bold text-3xl text-success">
                          {flashSaleProducts.length > 0
                            ? Math.round(flashSaleProducts.reduce((s, p) => s + (p.discount || 0), 0) / flashSaleProducts.length)
                            : 0}%
                        </p>
                      </div>
                    </div>

                    {/* Product Flash-Sale Table */}
                    <div className="glass-card rounded-2xl border border-border bg-surface overflow-hidden">
                      <div className="p-5 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary text-sm">All Approved Products — Flash Sale Settings</h3>
                        <span className="text-xs text-text-muted">{eligibleProducts.length} products</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-surface-2 text-text-muted font-bold uppercase tracking-wider">
                              <th className="p-4">Product</th>
                              <th className="p-4">Current Price</th>
                              <th className="p-4">Flash Sale</th>
                              <th className="p-4">Discount %</th>
                              <th className="p-4">Flash Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {eligibleProducts.length === 0 && (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-text-muted">No approved products. Approve seller products first.</td>
                              </tr>
                            )}
                            {eligibleProducts.map((p) => {
                              const disc = p.discount || 0;
                              const flashPrice = p.isFlashSale
                                ? Math.round((p.originalPrice || p.price) * (1 - disc / 100))
                                : p.price;
                              return (
                                <tr key={p.id} className={`hover:bg-surface-2/40 transition-colors ${p.isFlashSale ? "bg-warning/5" : ""}`}>
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
                                        <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-text-primary truncate max-w-[160px]">{p.name}</p>
                                        <p className="text-text-muted text-[10px]">{p.brand}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 font-bold">₹{(p.originalPrice || p.price)?.toLocaleString("en-IN")}</td>
                                  <td className="p-4">
                                    <button
                                      onClick={() => handleToggleFlashSale(p.id, !!p.isFlashSale)}
                                      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${p.isFlashSale ? "bg-warning" : "bg-surface-3 border border-border"}`}
                                      title={p.isFlashSale ? "Disable Flash Sale" : "Enable Flash Sale"}
                                    >
                                      <span className={`inline-block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 m-1 ${p.isFlashSale ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min="0"
                                        max="90"
                                        defaultValue={disc}
                                        disabled={!p.isFlashSale}
                                        onBlur={(e) => handleUpdateFlashDiscount(p.id, parseInt(e.target.value))}
                                        className={`w-16 bg-surface-2 border border-border rounded-lg px-2 py-1.5 text-center text-text-primary focus:outline-none focus:border-primary transition-all ${!p.isFlashSale ? "opacity-40 cursor-not-allowed" : ""}`}
                                      />
                                      <span className="text-text-muted">%</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    {p.isFlashSale ? (
                                      <span className="font-bold text-warning">₹{flashPrice?.toLocaleString("en-IN")}</span>
                                    ) : (
                                      <span className="text-text-muted">—</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Categories Management Tab ── */}
              {activeTab === "categories" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-primary" />
                    <div>
                      <h2 className="font-display font-bold text-xl text-text-primary">Categories Management</h2>
                      <p className="text-text-muted text-xs mt-0.5">Add, edit, or remove departments/categories from the platform.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Category Form */}
                    <div className="glass-card rounded-2xl border border-border bg-surface p-6 space-y-4 h-fit">
                      <h3 className="font-semibold text-text-primary text-sm border-b border-border pb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-primary" /> Add New Category
                      </h3>
                      <form onSubmit={handleAddCategory} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Category Name *</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Home Decor"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Emoji Icon</label>
                            <input
                              type="text"
                              value={categoryForm.icon}
                              onChange={(e) => setCategoryForm(f => ({ ...f, icon: e.target.value }))}
                              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors text-center"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Accent Color</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={categoryForm.color}
                                onChange={(e) => setCategoryForm(f => ({ ...f, color: e.target.value }))}
                                className="w-10 h-10 bg-transparent border-0 cursor-pointer animate-none"
                              />
                              <input
                                type="text"
                                value={categoryForm.color}
                                onChange={(e) => setCategoryForm(f => ({ ...f, color: e.target.value }))}
                                className="w-full bg-surface-2 border border-border rounded-xl px-2 py-2 text-xs text-text-primary focus:outline-none focus:border-primary transition-colors text-center font-mono"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Cover Image URL</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={categoryForm.image}
                            onChange={(e) => setCategoryForm(f => ({ ...f, image: e.target.value }))}
                            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 mt-4"
                        >
                          <Plus className="w-4 h-4" /> Create Category
                        </button>
                      </form>
                    </div>

                    {/* Category List */}
                    <div className="lg:col-span-2 glass-card rounded-2xl border border-border bg-surface overflow-hidden">
                      <div className="p-5 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary text-sm">Active Departments</h3>
                        <span className="text-xs text-text-muted">{localCategories.length} Categories</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-surface-2 text-text-muted font-bold uppercase tracking-wider">
                              <th className="p-4">Icon &amp; Name</th>
                              <th className="p-4">Slug</th>
                              <th className="p-4">Color</th>
                              <th className="p-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {localCategories.map((cat) => (
                              <tr key={cat.id} className="hover:bg-surface-2/40 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl p-1.5 rounded-lg bg-surface-3 border border-border">{cat.icon || "📦"}</span>
                                    <p className="font-bold text-text-primary">{cat.name}</p>
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-[10px] text-text-muted">{cat.slug}</td>
                                <td className="p-4 flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 rounded-full border border-border/30 animate-none" style={{ backgroundColor: cat.color }} />
                                  <span className="font-mono text-[10px] text-text-secondary">{cat.color}</span>
                                </td>
                                <td className="p-4 text-right">
                                  {["electronics", "fashion", "home-living", "sports", "beauty", "gaming", "automotive", "books"].includes(cat.slug) ? (
                                    <span className="text-text-muted text-[10px]">Protected System</span>
                                  ) : (
                                    <button
                                      onClick={() => handleDeleteCategory(cat.id)}
                                      className="p-1.5 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-lg transition-all"
                                      title="Delete Category"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>
      <Footer />
    </>
  );
}
