"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Plus, Sparkles, TrendingUp, AlertTriangle,
  DollarSign, Package, Users, Settings, LogOut, ChevronRight, Upload,
  Download, Eye, Star, Trash2, Calendar
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { mockProducts, mockRevenueData } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";

const stats = [
  { label: "Total Revenue", value: 342950, change: 12.5, type: "increase", icon: DollarSign, prefix: "₹" },
  { label: "Orders Fulfilled", value: 1240, change: 8.2, type: "increase", icon: ShoppingBag },
  { label: "Active Listings", value: 24, change: 0, type: "neutral", icon: Package },
  { label: "Store Rating", value: 4.8, change: 0.1, type: "increase", icon: Star, suffix: "/5" },
];

const lowStockItems = mockProducts.filter((p) => p.stock < 20);

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "orders" | "add-product">("overview");

  // Add Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "electronics",
    brand: "",
    stock: "",
    description: "",
    sku: "",
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Product created successfully! Pending admin approval.");
    setProductForm({
      name: "",
      price: "",
      originalPrice: "",
      category: "electronics",
      brand: "",
      stock: "",
      description: "",
      sku: "",
    });
    setActiveTab("listings");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16 flex">
        
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-[calc(100vh-6rem)] sticky top-24">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                TZ
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-sm">TechZone Official</h3>
                <span className="badge badge-success text-[10px] py-0 mt-1">Verified Seller</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
              { id: "listings" as const, label: "Product Listings", icon: Package },
              { id: "orders" as const, label: "Seller Orders", icon: ShoppingBag },
              { id: "add-product" as const, label: "Upload Product", icon: Plus },
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

          <div className="p-4 border-t border-border space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:bg-surface-2 transition-all"
            >
              <Eye className="w-4 h-4" />
              Go to Storefront
            </Link>
          </div>
        </aside>

        {/* Dashboard Main Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1200px]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-text-primary">Seller Center</h1>
              <p className="text-text-muted mt-1">Manage listings, analyze sales patterns, and create coupons.</p>
            </div>
            {activeTab === "overview" && (
              <button
                onClick={() => setActiveTab("add-product")}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload New Product
              </button>
            )}
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
              {/* Overview Dashboard Tab */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
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

                  {/* Revenue Area Chart */}
                  <div className="glass-card rounded-3xl border border-border p-6 bg-surface">
                    <h3 className="font-display font-bold text-lg text-text-primary mb-6">Revenue Performance</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockRevenueData}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                          <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                          <Tooltip contentStyle={{ background: "#111118", border: "1px solid #1f1f2e" }} />
                          <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Low Stock Warnings */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl border border-border p-6 bg-surface">
                      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                        <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          Low Stock Alerts
                        </h3>
                        <span className="badge badge-warning">{lowStockItems.length} items</span>
                      </div>
                      <div className="space-y-3">
                        {lowStockItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-text-primary truncate max-w-[200px]">{item.name}</span>
                            <span className="font-bold text-danger">{item.stock} left</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl border border-border p-6 bg-surface">
                      <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                        <h3 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Recent Performance Suggestions
                        </h3>
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Our AI recommends increasing the price of your <b>Apple MacBook Pro</b> by 5% as demand is high and stock is decreasing.
                      </p>
                      <button className="mt-4 text-xs font-bold text-primary hover:underline">
                        Apply AI Pricing Strategy →
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Product Listings Tab */}
              {activeTab === "listings" && (
                <div className="glass-card rounded-3xl border border-border overflow-hidden bg-surface">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Sku</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockProducts.slice(0, 5).map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <img src={item.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-surface-2" />
                              <div>
                                <p className="font-semibold text-text-primary">{item.name}</p>
                                <p className="text-xs text-text-muted">{item.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td>{item.category.name}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td className={item.stock < 20 ? "text-danger font-bold" : "text-success font-semibold"}>
                            {item.stock} units
                          </td>
                          <td className="font-mono text-xs text-text-muted">{item.sku}</td>
                          <td>
                            <div className="flex gap-2">
                              <button className="p-2 rounded-lg bg-surface-2 hover:bg-primary/20 text-text-muted hover:text-primary transition-all">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-lg bg-surface-2 hover:bg-danger/10 text-text-muted hover:text-danger transition-all">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Seller Orders Tab */}
              {activeTab === "orders" && (
                <div className="glass-card rounded-3xl border border-border p-6 bg-surface text-center py-12">
                  <ShoppingBag className="w-12 h-12 mx-auto text-text-muted mb-4" />
                  <h3 className="font-display font-bold text-lg text-text-primary">No new orders</h3>
                  <p className="text-text-muted text-sm mt-1">Check back later or optimize your listings with AI dynamic pricing.</p>
                </div>
              )}

              {/* Upload Product Form Tab */}
              {activeTab === "add-product" && (
                <form onSubmit={handleProductSubmit} className="glass-card rounded-3xl border border-border p-8 bg-surface space-y-6">
                  <h2 className="font-display font-bold text-2xl text-text-primary flex items-center gap-2 border-b border-border pb-4">
                    <Upload className="w-6 h-6 text-primary" />
                    Upload New Product
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase">Product Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        id="prod-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase">Brand *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        id="prod-brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase">Price (INR) *</label>
                      <input
                        type="number"
                        required
                        className="input"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        id="prod-price"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase">Original Price (INR)</label>
                      <input
                        type="number"
                        className="input"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                        id="prod-orig-price"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase">Category *</label>
                      <select
                        className="input"
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        id="prod-category-select"
                      >
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home-living">Home & Living</option>
                        <option value="sports">Sports</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase">Stock Count *</label>
                      <input
                        type="number"
                        required
                        className="input"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        id="prod-stock"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase">Product Description *</label>
                      <textarea
                        required
                        rows={4}
                        className="input min-h-[100px] resize-y"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        id="prod-desc"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="px-6 py-2.5 rounded-xl border border-border text-text-secondary font-semibold hover:bg-surface-2 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary px-8 py-2.5 font-bold"
                    >
                      Publish Listing
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
      <Footer />
    </>
  );
}
