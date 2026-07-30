"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, ChevronDown, ChevronRight, CheckCircle, Package,
  Truck, AlertTriangle, XCircle, Clock, MapPin, User, CreditCard,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { formatCurrency, cn } from "@/lib/utils";

const ALL_STATUSES = ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "rejected"];
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  rejected: "Rejected",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-primary/10 text-primary border-primary/20",
  processing: "bg-secondary/10 text-secondary border-secondary/20",
  packed: "bg-electric/10 text-blue-500 border-blue-500/20",
  shipped: "bg-primary/10 text-primary border-primary/20",
  out_for_delivery: "bg-accent/10 text-accent border-accent/20",
  delivered: "bg-success/10 text-success border-success/20",
  rejected: "bg-danger/10 text-danger border-danger/20",
};

const WORKFLOW_ACTIONS: Record<string, { label: string; next: string; color: string }> = {
  pending: { label: "Accept Order", next: "processing", color: "bg-primary text-white" },
  confirmed: { label: "Start Processing", next: "processing", color: "bg-primary text-white" },
  processing: { label: "Mark Packed", next: "packed", color: "bg-secondary text-white" },
  packed: { label: "Mark Shipped", next: "shipped", color: "bg-blue-600 text-white" },
  shipped: { label: "Out for Delivery", next: "out_for_delivery", color: "bg-accent text-white" },
  out_for_delivery: { label: "Mark Delivered", next: "delivered", color: "bg-success text-white" },
};

const FILTER_TABS = ["all", "pending", "processing", "shipped", "delivered", "rejected"];

export default function SellerOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{ orderId: string; itemIdx: number } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadOrders = () => {
    if (!user) return;
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-orders") || "[]");
    const mine = all.filter((o) =>
      (o.items || []).some((i: any) => i.sellerId === user.id || !i.sellerId)
    );
    setOrders(mine.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    // Mark notifications as read
    const notifs: any[] = JSON.parse(localStorage.getItem(`nexmart-seller-notifications-${user.id}`) || "[]");
    const read = notifs.map((n) => ({ ...n, read: true }));
    localStorage.setItem(`nexmart-seller-notifications-${user.id}`, JSON.stringify(read));
  };

  useEffect(() => {
    setMounted(true);
    loadOrders();
  }, [user]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateItemStatus = (orderId: string, itemIdx: number, newStatus: string) => {
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-orders") || "[]");
    const updated = all.map((o: any) => {
      if (o.id !== orderId) return o;
      const statusIdx = ALL_STATUSES.indexOf(newStatus);
      const updatedItems = (o.items || []).map((item: any, idx: number) => {
        if (idx !== itemIdx) return item;
        const timeline = ALL_STATUSES.slice(0, statusIdx + 1).map((s) => ({
          status: s,
          desc: {
            pending: "Order placed",
            confirmed: "Payment confirmed",
            processing: "Being processed",
            packed: "Packed by seller",
            shipped: "Shipped",
            out_for_delivery: "Out for delivery",
            delivered: "Delivered",
            rejected: "Rejected by seller",
          }[s] || s,
          timestamp: new Date().toISOString(),
          active: true,
        }));
        return { ...item, currentStatus: newStatus, timeline };
      });
      const highestIdx = Math.max(...updatedItems.map((it: any) => ALL_STATUSES.indexOf(it.currentStatus || "pending")));
      return { ...o, items: updatedItems, status: ALL_STATUSES[highestIdx] || o.status };
    });
    localStorage.setItem("nexmart-orders", JSON.stringify(updated));
    loadOrders();
    showToast(`Status updated to "${STATUS_LABELS[newStatus]}"`);
  };

  const handleReject = () => {
    if (!rejectDialog) return;
    updateItemStatus(rejectDialog.orderId, rejectDialog.itemIdx, "rejected");
    setRejectDialog(null);
    setRejectReason("");
    showToast("Order item rejected and customer notified.");
  };

  // Filtered
  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter || (o.items || []).some((i: any) => i.currentStatus === filter);
  });

  const statCounts: Record<string, number> = {};
  FILTER_TABS.forEach((t) => {
    statCounts[t] = t === "all"
      ? orders.length
      : orders.filter((o) => o.status === t || (o.items || []).some((i: any) => (i.currentStatus || "pending") === t)).length;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 relative">
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-xl flex items-center gap-2 ${toast.type === "success" ? "bg-success" : "bg-danger"}`}
          >
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Order Fulfillment</p>
          <h1 className="font-display font-black text-2xl text-text-primary">Orders</h1>
        </div>
        <div className="text-right">
          <p className="font-black text-2xl text-text-primary">{orders.length}</p>
          <p className="text-text-muted text-xs font-semibold">Total Orders</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 relative z-10">
        {FILTER_TABS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border",
              filter === f ? "bg-primary text-white border-primary shadow-lg" : "bg-surface border-border text-text-muted hover:text-text-primary"
            )}
          >
            {f.replace("_", " ")}
            {statCounts[f] > 0 && (
              <span className={cn("min-w-[18px] h-[18px] rounded-full text-[9px] flex items-center justify-center px-1",
                filter === f ? "bg-white/20 text-white" : "bg-surface-3 text-text-muted")}>
                {statCounts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4 relative z-10">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-12 h-12 text-text-muted/30 mb-4" />
            <p className="font-bold text-text-primary">No orders found</p>
            <p className="text-text-muted text-sm mt-1">Orders from customers will appear here</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expanded === order.id;
            const myItems = (order.items || []).filter((i: any) => i.sellerId === user?.id || !i.sellerId);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden"
              >
                {/* Order Header Row */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 cursor-pointer hover:bg-surface-2/50 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-black text-text-primary text-sm">{order.orderNumber}</p>
                      <span className={cn("text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-wider", STATUS_COLORS[order.status] || STATUS_COLORS.pending)}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-text-muted font-semibold flex-wrap">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{order.userName}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                      <span className="flex items-center gap-1"><Package className="w-3 h-3" />{myItems.length} item(s)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-display font-black text-text-primary">{formatCurrency(order.total || 0)}</p>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronRight className="w-4 h-4 text-text-muted" />}
                  </div>
                </div>

                {/* Expanded Order Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border overflow-hidden"
                    >
                      <div className="p-5 space-y-6">
                        {/* Order Meta */}
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-surface-2 border border-border">
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Shipping To</p>
                            <p className="text-xs font-semibold text-text-primary flex items-start gap-1">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              {order.address || "Address not provided"}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-surface-2 border border-border">
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Customer</p>
                            <p className="text-xs font-bold text-text-primary">{order.userName}</p>
                            <p className="text-[10px] text-text-muted">{order.userEmail}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-surface-2 border border-border">
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Payment</p>
                            <p className="text-xs font-bold text-success flex items-center gap-1">
                              <CreditCard className="w-3 h-3" /> Paid
                            </p>
                            <p className="text-[10px] text-text-muted mt-0.5">{order.trackingNumber}</p>
                          </div>
                        </div>

                        {/* Items with status actions */}
                        <div className="space-y-3">
                          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Order Items</p>
                          {myItems.map((item: any, idx: number) => {
                            const itemStatus = item.currentStatus || order.status || "pending";
                            const action = WORKFLOW_ACTIONS[itemStatus];
                            return (
                              <div key={idx} className="p-4 rounded-xl bg-surface-2 border border-border">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-3 flex-shrink-0">
                                    <img src={item.img || "https://placehold.co/48"} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-text-primary text-xs">{item.name}</p>
                                    <p className="text-text-muted text-[10px]">Qty: {item.qty} × {formatCurrency(item.price)}</p>
                                  </div>
                                  <span className={cn("text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-wider", STATUS_COLORS[itemStatus] || STATUS_COLORS.pending)}>
                                    {STATUS_LABELS[itemStatus] || itemStatus}
                                  </span>
                                  <div className="flex gap-2">
                                    {action && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); updateItemStatus(order.id, idx, action.next); }}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${action.color} hover:opacity-80`}
                                      >
                                        {action.label}
                                      </button>
                                    )}
                                    {(itemStatus === "pending" || itemStatus === "confirmed") && (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setRejectDialog({ orderId: order.id, itemIdx: idx }); }}
                                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-danger/10 text-danger border border-danger/20 hover:bg-danger hover:text-white transition-all"
                                      >
                                        Reject
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Mini Timeline */}
                                {item.timeline && item.timeline.length > 0 && (
                                  <div className="mt-4 flex items-center gap-1 overflow-x-auto">
                                    {item.timeline.map((t: any, ti: number) => (
                                      <div key={ti} className="flex items-center gap-1 flex-shrink-0">
                                        <div className={cn(
                                          "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black",
                                          t.active ? "bg-primary text-white" : "bg-surface-3 text-text-muted"
                                        )}>
                                          {ti + 1}
                                        </div>
                                        <span className={cn("text-[9px] font-bold whitespace-nowrap", t.active ? "text-primary" : "text-text-muted/50")}>
                                          {STATUS_LABELS[t.status] || t.status}
                                        </span>
                                        {ti < item.timeline.length - 1 && (
                                          <div className={cn("w-6 h-px", t.active ? "bg-primary" : "bg-border")} />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Reject Dialog */}
      <AnimatePresence>
        {rejectDialog && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setRejectDialog(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl border border-border p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-danger" />
              </div>
              <h3 className="font-display font-black text-lg text-text-primary text-center mb-2">Reject Order Item?</h3>
              <p className="text-text-muted text-xs text-center mb-4">Provide a reason for rejecting this order item. The customer will be notified.</p>
              <textarea
                value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                className="input border-border rounded-xl text-sm text-text-primary w-full h-20 resize-none mb-4"
                placeholder="e.g. Item out of stock, unable to fulfil..."
              />
              <div className="flex gap-3">
                <button onClick={() => setRejectDialog(null)} className="flex-1 py-2.5 rounded-xl border border-border text-text-secondary font-bold text-sm">Cancel</button>
                <button onClick={handleReject} className="flex-1 py-2.5 rounded-xl bg-danger text-white font-bold text-sm hover:bg-danger/80 transition-all">Confirm Reject</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
