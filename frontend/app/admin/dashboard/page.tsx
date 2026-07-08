"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Users, ShieldAlert, Sparkles, TrendingUp,
  AlertTriangle, DollarSign, Package, Settings, LogOut, ChevronRight,
  Eye, RefreshCw, BarChart2, Star, CheckCircle, XCircle
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { mockRevenueData } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line
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
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "fraud" | "inventory">("overview");

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
                <h3 className="font-semibold text-text-primary text-sm">System Admin</h3>
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

              {/* User management fallback */}
              {activeTab === "users" && (
                <div className="glass-card rounded-3xl border border-border p-8 bg-surface text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-text-muted mb-4" />
                  <h3 className="font-display font-bold text-lg text-text-primary">User directory is active</h3>
                  <p className="text-text-muted text-sm mt-1">Search, modify permissions, or block users from this interface.</p>
                </div>
              )}

              {/* Inventory health fallback */}
              {activeTab === "inventory" && (
                <div className="glass-card rounded-3xl border border-border p-8 bg-surface text-center py-12">
                  <Package className="w-12 h-12 mx-auto text-text-muted mb-4" />
                  <h3 className="font-display font-bold text-lg text-text-primary">Inventory database synchronized</h3>
                  <p className="text-text-muted text-sm mt-1">Review catalog status, restocking cycles, and seller listing counts.</p>
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
