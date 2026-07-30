"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, AlertTriangle, TrendingDown, CheckCircle, Save, Download, Upload, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { formatCurrency, cn } from "@/lib/utils";

function StatCard({ label, value, suffix = "", icon: Icon, color }: any) {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-card flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">{label}</p>
        <p className="font-display font-black text-xl text-text-primary">{value}{suffix}</p>
      </div>
    </div>
  );
}

interface StockLog {
  id: string;
  productId: string;
  productName: string;
  before: number;
  after: number;
  delta: number;
  timestamp: string;
}

export default function SellerInventoryPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState(0);
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [csvText, setCsvText] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const load = () => {
    if (!user) return;
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    setProducts(all.filter((p) => p.seller?.id === user.id));
    const l: StockLog[] = JSON.parse(localStorage.getItem(`nexmart-stock-logs-${user.id}`) || "[]");
    setLogs(l.slice(0, 20));
  };

  useEffect(() => { load(); }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const saveStock = (p: any) => {
    if (editVal < 0) return;
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    const updated = all.map((x) => x.id === p.id ? { ...x, stock: editVal } : x);
    localStorage.setItem("nexmart-products", JSON.stringify(updated));

    // Log adjustment
    const newLog: StockLog = {
      id: `log-${Date.now()}`, productId: p.id, productName: p.name,
      before: p.stock, after: editVal, delta: editVal - p.stock,
      timestamp: new Date().toISOString(),
    };
    const existingLogs: StockLog[] = JSON.parse(localStorage.getItem(`nexmart-stock-logs-${user?.id}`) || "[]");
    existingLogs.unshift(newLog);
    localStorage.setItem(`nexmart-stock-logs-${user?.id}`, JSON.stringify(existingLogs.slice(0, 50)));

    setEditingId(null);
    load();
    showToast(`Stock updated to ${editVal} units for "${p.name}"`);
  };

  const exportCsv = () => {
    const rows = ["SKU,Name,Price,Stock,Status"];
    products.forEach((p) => {
      rows.push(`${p.sku || ""},${p.name},${p.price},${p.stock},${p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock"}`);
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "inventory.csv"; a.click();
    showToast("Inventory exported as CSV");
  };

  const importCsv = () => {
    const lines = csvText.trim().split("\n").slice(1); // skip header
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    let updated = 0;
    lines.forEach((line) => {
      const [sku, , , stock] = line.split(",");
      const idx = all.findIndex((p) => p.sku === sku && p.seller?.id === user?.id);
      if (idx !== -1 && !isNaN(parseInt(stock))) {
        all[idx].stock = parseInt(stock);
        updated++;
      }
    });
    localStorage.setItem("nexmart-products", JSON.stringify(all));
    setShowBulk(false);
    setCsvText("");
    load();
    showToast(`${updated} products updated via CSV import`);
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || "").includes(search)
  );

  const totalValue = products.reduce((s, p) => s + (p.price * (p.stock || 0)), 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-success text-white text-sm font-bold shadow-xl flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Stock Management</p>
          <h1 className="font-display font-black text-2xl text-text-primary">Inventory</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowBulk(!showBulk)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary font-bold text-xs uppercase tracking-wider transition-all">
            <Upload className="w-3.5 h-3.5" /> Bulk Import
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary font-bold text-xs uppercase tracking-wider transition-all">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={load} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-primary/90 transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <StatCard label="Total SKUs" value={products.length} icon={Boxes} color="bg-primary" />
        <StatCard label="Inventory Value" value={`₹${(totalValue / 1000).toFixed(1)}K`} icon={CheckCircle} color="bg-success" />
        <StatCard label="Low Stock" value={lowStock} suffix=" items" icon={AlertTriangle} color="bg-warning" />
        <StatCard label="Out of Stock" value={outOfStock} suffix=" items" icon={TrendingDown} color="bg-danger" />
      </div>

      {/* Bulk CSV Import panel */}
      <AnimatePresence>
        {showBulk && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="relative z-10 p-5 rounded-2xl bg-surface-2 border border-border overflow-hidden"
          >
            <p className="text-xs font-bold text-text-primary mb-2">Paste CSV content (SKU,Name,Price,Stock):</p>
            <p className="text-[10px] text-text-muted mb-3">Header row is skipped. Only SKU and Stock columns are used for matching and updating.</p>
            <textarea
              value={csvText} onChange={(e) => setCsvText(e.target.value)}
              className="input border-border rounded-xl text-xs font-mono text-text-primary w-full h-28 resize-none"
              placeholder={`SKU,Name,Price,Stock\nAPL-001,iPhone 15,79999,50\nSAM-002,Galaxy S23,69999,30`}
            />
            <div className="flex gap-3 mt-3">
              <button onClick={() => setShowBulk(false)} className="px-4 py-2 rounded-xl border border-border text-text-secondary text-xs font-bold">Cancel</button>
              <button onClick={importCsv} className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all">
                <Upload className="w-3.5 h-3.5" /> Apply Import
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative z-10">
        <input
          type="text" placeholder="Search by name or SKU..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="input border-border rounded-xl text-sm text-text-primary w-full max-w-sm"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-card relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                {["Product", "SKU", "Price", "In Stock", "Reserved", "Available", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p, i) => {
                const reserved = Math.floor(Math.random() * 3); // Simulated reserved (orders in transit)
                const available = Math.max(0, (p.stock || 0) - reserved);
                return (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-surface-3 flex-shrink-0">
                          <img src={p.images?.[0] || "https://placehold.co/36"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="font-semibold text-text-primary text-xs truncate max-w-[140px]">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted font-mono">{p.sku || "—"}</td>
                    <td className="px-4 py-3 text-xs font-bold text-text-primary">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      {editingId === p.id ? (
                        <input
                          type="number" value={editVal} onChange={(e) => setEditVal(parseInt(e.target.value) || 0)}
                          onKeyDown={(e) => e.key === "Enter" && saveStock(p)}
                          className="w-20 px-2 py-1.5 rounded-xl border border-primary bg-surface-2 text-sm font-bold text-text-primary outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-bold text-text-primary">{p.stock || 0}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted">{reserved}</td>
                    <td className="px-4 py-3 text-xs text-text-secondary font-semibold">{available}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
                        p.stock === 0 ? "bg-danger/10 text-danger"
                        : p.stock < 10 ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                      )}>
                        {p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === p.id ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => saveStock(p)} className="px-3 py-1.5 rounded-xl bg-success text-white text-[10px] font-black hover:bg-success/80 transition-all">
                            Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-xl border border-border text-text-muted text-[10px] font-black hover:border-primary/30 transition-all">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(p.id); setEditVal(p.stock || 0); }}
                          className="px-3 py-1.5 rounded-xl border border-border text-text-muted text-[10px] font-black hover:border-primary hover:text-primary transition-all"
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Logs */}
      {logs.length > 0 && (
        <div className="relative z-10">
          <h3 className="font-display font-bold text-base text-text-primary mb-4">Stock Adjustment History</h3>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-card">
            <div className="divide-y divide-border">
              {logs.map((l) => (
                <div key={l.id} className="flex items-center gap-4 px-5 py-3 text-xs hover:bg-surface-2/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">{l.productName}</p>
                    <p className="text-text-muted text-[10px]">{new Date(l.timestamp).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted">{l.before} → {l.after}</span>
                    <span className={cn("font-black px-2 py-1 rounded-lg", l.delta > 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                      {l.delta > 0 ? "+" : ""}{l.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
