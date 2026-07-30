"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, Package, Star, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Bell, Plus, RefreshCw, Eye, Zap, CheckCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function StatCard({
  label, value, prefix = "", suffix = "", icon: Icon, change, type, gradient,
}: {
  label: string; value: string | number; prefix?: string; suffix?: string;
  icon: any; change?: number; type?: "increase" | "decrease" | "neutral"; gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-surface border border-border shadow-card relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 ${gradient || "bg-primary"}`} />
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        {change !== undefined && type !== "neutral" && (
          <div className={`flex items-center gap-1 text-xs font-bold ${type === "increase" ? "text-success" : "text-danger"}`}>
            {type === "increase" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="font-display font-black text-2xl text-text-primary">
        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}{suffix}
      </p>
    </motion.div>
  );
}

export default function SellerDashboardPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) return;
    const prods: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    setProducts(prods.filter((p) => p.seller?.id === user.id));

    const ords: any[] = JSON.parse(localStorage.getItem("nexmart-orders") || "[]");
    setOrders(
      ords.filter((o) => (o.items || []).some((i: any) => i.sellerId === user.id))
    );

    const notifs: any[] = JSON.parse(localStorage.getItem(`nexmart-seller-notifications-${user.id}`) || "[]");
    setNotifications(notifs.slice(0, 6));
  }, [user]);

  if (!mounted) return null;

  const totalRevenue = orders.reduce((sum, o) =>
    sum + (o.items || []).filter((i: any) => i.sellerId === user?.id)
      .reduce((s: number, i: any) => s + (i.price * i.qty), 0), 0
  );
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const lowStockProds = products.filter((p) => p.stock < 10);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const avgRating = products.length > 0
    ? (products.reduce((s, p) => s + (p.rating || 5), 0) / products.length).toFixed(1)
    : "5.0";
  const inventoryValue = products.reduce((s, p) => s + p.price * (p.stock || 0), 0);

  // Generate revenue chart data from last 14 days
  const revenueChart = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      revenue: Math.floor(Math.random() * 30000 + 5000 + totalRevenue * 0.05),
    };
  });

  const stats = [
    { label: "Total Revenue", value: totalRevenue, prefix: "₹", icon: DollarSign, change: 12.5, type: "increase" as const, gradient: "bg-primary" },
    { label: "Pending Orders", value: pendingOrders, icon: ShoppingBag, change: 0, type: "neutral" as const, gradient: "bg-warning" },
    { label: "Active Listings", value: products.length, icon: Package, change: 0, type: "neutral" as const, gradient: "bg-secondary" },
    { label: "Store Rating", value: avgRating, suffix: " / 5", icon: Star, change: 0.1, type: "increase" as const, gradient: "bg-accent" },
    { label: "Inventory Value", value: inventoryValue, prefix: "₹", icon: TrendingUp, change: 0, type: "neutral" as const, gradient: "bg-electric" },
    { label: "Delivered", value: deliveredOrders, icon: CheckCircle, change: 0, type: "neutral" as const, gradient: "bg-success" },
  ];

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.04] pointer-events-none bg-gradient-to-br from-primary to-secondary" />
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="font-display font-black text-2xl md:text-3xl text-text-primary">
            {user?.name}&apos;s Dashboard
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/seller/products"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-primary/90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Link>
          <Link
            href="/seller/orders"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-primary/30 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            View Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main Grid: Chart + Notifications */}
      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Revenue</p>
              <h3 className="font-display font-bold text-lg text-text-primary">Last 14 Days</h3>
            </div>
            <span className="badge badge-primary text-[9px]">LIVE</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="sellerRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "11px" }}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#sellerRevGrad)" dot={false} activeDot={{ r: 5, fill: "#6366f1" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Inbox</p>
              <h3 className="font-display font-bold text-lg text-text-primary">Notifications</h3>
            </div>
            {unreadNotifs > 0 && (
              <span className="badge badge-danger text-[9px] animate-pulse">{unreadNotifs} NEW</span>
            )}
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Bell className="w-8 h-8 text-text-muted/30 mb-2" />
                <p className="text-text-muted text-xs font-semibold">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={n.id || i} className={`p-3 rounded-xl border text-xs transition-all ${!n.read ? "border-primary/20 bg-primary/5" : "border-border bg-surface-2/50"}`}>
                  <p className={`font-semibold ${!n.read ? "text-text-primary" : "text-text-secondary"}`}>{n.message || n.title}</p>
                  <p className="text-text-muted text-[10px] mt-1">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN") : ""}
                  </p>
                </div>
              ))
            )}
          </div>
          <Link href="/seller/orders" className="mt-4 text-center text-xs font-bold text-primary hover:text-primary/80 transition-colors">
            View all orders →
          </Link>
        </div>
      </div>

      {/* Low Stock Alerts + Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        {/* Low Stock Alerts */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Alerts</p>
              <h3 className="font-display font-bold text-lg text-text-primary">Low Stock</h3>
            </div>
            {outOfStock > 0 && (
              <span className="badge badge-danger text-[9px]">{outOfStock} OUT OF STOCK</span>
            )}
          </div>
          {lowStockProds.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <CheckCircle className="w-8 h-8 text-success/50 mb-2" />
              <p className="text-text-muted text-xs font-semibold">All products are well-stocked</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockProds.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-border">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-3 flex-shrink-0">
                    <img src={p.images?.[0] || "https://placehold.co/40"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-semibold text-xs truncate">{p.name}</p>
                    <p className="text-text-muted text-[10px]">SKU: {p.sku || "N/A"}</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${p.stock === 0 ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}>
                    {p.stock === 0 ? "OUT" : `${p.stock} left`}
                  </span>
                </div>
              ))}
              <Link href="/seller/inventory" className="block text-center text-xs font-bold text-primary mt-2 hover:text-primary/80 transition-colors">
                Manage Inventory →
              </Link>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Activity</p>
              <h3 className="font-display font-bold text-lg text-text-primary">Recent Orders</h3>
            </div>
          </div>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <ShoppingBag className="w-8 h-8 text-text-muted/30 mb-2" />
              <p className="text-text-muted text-xs font-semibold">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-border text-xs">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-primary truncate">{o.orderNumber}</p>
                    <p className="text-text-muted text-[10px]">{o.userName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg font-bold uppercase text-[9px] tracking-wide ${
                    o.status === "delivered" ? "bg-success/10 text-success"
                    : o.status === "pending" ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary"
                  }`}>{o.status}</span>
                  <span className="font-black text-text-primary">{formatCurrency(o.total || 0)}</span>
                </div>
              ))}
              <Link href="/seller/orders" className="block text-center text-xs font-bold text-primary mt-2 hover:text-primary/80 transition-colors">
                View all orders →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
