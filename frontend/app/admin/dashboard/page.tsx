"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Users, ShieldAlert, Sparkles, TrendingUp,
  AlertTriangle, DollarSign, Package, Settings, LogOut, ChevronRight,
  Eye, RefreshCw, BarChart2, Star, CheckCircle, XCircle, Search, Edit, Trash2
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { mockRevenueData, mockProducts } from "@/lib/mock-data";
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
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "fraud" | "inventory">("overview");

  // Local state for dynamically loaded tables
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [localProducts, setLocalProducts] = useState<any[]>([]);

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

  // Load User & Product list
  useEffect(() => {
    if (typeof window !== "undefined") {
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
      setLocalProducts(mockProducts);
    }
  }, []);

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

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
              { id: "users" as const, label: "User Management", icon: Users },
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
                <tab.icon className="w-4 h-4" />
                {tab.label}
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
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
      <Footer />
    </>
  );
}
