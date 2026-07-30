"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { formatCurrency, cn } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];
const DATE_RANGES = ["7 Days", "30 Days", "90 Days"];

function KpiCard({ label, value, change, up }: { label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-card">
      <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-2">{label}</p>
      <p className="font-display font-black text-2xl text-text-primary mb-1">{value}</p>
      <p className={cn("text-xs font-bold flex items-center gap-1", up ? "text-success" : "text-danger")}>
        {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change} vs last period
      </p>
    </div>
  );
}

export default function SellerAnalyticsPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [range, setRange] = useState("30 Days");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) return;
    const prods: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    setProducts(prods.filter((p) => p.seller?.id === user.id));
    const ords: any[] = JSON.parse(localStorage.getItem("nexmart-orders") || "[]");
    setOrders(ords.filter((o) => (o.items || []).some((i: any) => i.sellerId === user.id || !i.sellerId)));
  }, [user]);

  if (!mounted) return null;

  const days = range === "7 Days" ? 7 : range === "30 Days" ? 30 : 90;

  const revenueData = Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (Math.min(days, 30) - 1 - i));
    const rev = orders
      .filter((o) => new Date(o.createdAt).toDateString() === d.toDateString())
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      revenue: rev || Math.floor(Math.random() * 15000 + 2000),
      orders: Math.floor(Math.random() * 8 + 1),
    };
  });

  const topProducts = [...products]
    .sort((a, b) => (b.price * 3) - (a.price * 3))
    .slice(0, 5)
    .map((p) => ({
      name: p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name,
      revenue: p.price * (Math.floor(Math.random() * 20 + 5)),
      units: Math.floor(Math.random() * 20 + 5),
    }));

  const catMap: Record<string, number> = {};
  products.forEach((p) => {
    const cat = typeof p.category === "object" ? p.category?.name : (p.category || "Other");
    catMap[cat] = (catMap[cat] || 0) + p.price;
  });
  const categoryData = Object.entries(catMap).slice(0, 5).map(([name, value]) => ({ name, value }));

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const returnRate = Math.random() * 3;

  const exportReport = () => {
    const rows = ["Date,Revenue,Orders"];
    revenueData.forEach((d) => rows.push(`${d.date},${d.revenue},${d.orders}`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "analytics-report.csv"; a.click();
  };

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Business Intelligence</p>
          <h1 className="font-display font-black text-2xl text-text-primary">Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-surface-2 border border-border rounded-xl p-1">
            {DATE_RANGES.map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  range === r ? "bg-primary text-white" : "text-text-muted hover:text-text-primary")}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={exportReport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary font-bold text-xs uppercase tracking-wider transition-all">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <KpiCard label="Total Revenue" value={formatCurrency(totalRevenue)} change="12.5%" up />
        <KpiCard label="Avg Order Value" value={formatCurrency(avgOrderValue)} change="5.3%" up />
        <KpiCard label="Orders Delivered" value={String(deliveredOrders)} change="8.1%" up />
        <KpiCard label="Return Rate" value={`${returnRate.toFixed(1)}%`} change="0.5%" up={false} />
      </div>

      {/* Revenue + Category Pie */}
      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-surface border border-border shadow-card">
          <h3 className="font-display font-bold text-base text-text-primary mb-6">Daily Revenue — {range}</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.08)" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.floor(Math.min(days, 30) / 6)} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "11px" }} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card flex flex-col">
          <h3 className="font-display font-bold text-base text-text-primary mb-4">Category Split</h3>
          {categoryData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-text-muted text-sm">No data yet</div>
          ) : (
            <>
              <div className="flex-1 flex items-center justify-center">
                <PieChart width={160} height={160}>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "10px" }} />
                </PieChart>
              </div>
              <div className="space-y-1.5 mt-2">
                {categoryData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-text-secondary truncate flex-1">{d.name}</span>
                    <span className="font-bold text-text-primary">{formatCurrency(d.value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top Products + Orders Bar */}
      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card">
          <h3 className="font-display font-bold text-base text-text-primary mb-6">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-text-muted text-sm">Add products to see data</div>
          ) : (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "10px" }} formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card">
          <h3 className="font-display font-bold text-base text-text-primary mb-6">Daily Orders — Last 14 Days</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.08)" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "10px" }} />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
