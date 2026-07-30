"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Calendar, Truck, CheckCircle2, ChevronDown,
  ArrowRight, ShieldCheck, MapPin, Clock, ShoppingBag
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth";

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  processing: "PROCESSING",
  shipped: "SHIPPED",
  out_for_delivery: "OUT FOR DELIVERY",
  delivered: "DELIVERED",
};

const STATUS_DESCS: Record<string, string> = {
  pending: "Order placed by customer",
  confirmed: "Payment verified, order confirmed",
  processing: "Picked & packed at warehouse",
  shipped: "In transit to delivery hub",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered to customer",
};

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.replace("/auth/login?redirectTo=/orders");
      return;
    }
    loadOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const loadOrders = () => {
    if (typeof window === "undefined" || !user) return;
    const raw = localStorage.getItem("nexmart-orders");
    if (!raw) { setOrders([]); return; }
    const all: any[] = JSON.parse(raw);
    // Show orders belonging to this user (or all if admin)
    const userOrders = user.role === "admin"
      ? all
      : all.filter((o: any) => o.userId === user.id);
    setOrders(userOrders.reverse()); // newest first
    if (userOrders.length > 0 && !expandedOrder) {
      setExpandedOrder(userOrders[userOrders.length - 1].id); // expand most recent
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const activeOrder = orders.find((o) => o.id === expandedOrder) ?? orders[0] ?? null;

  // Build tracking timeline for the active order (from first item's timeline or order-level)
  const trackingTimeline = activeOrder
    ? (() => {
        // Get the highest status reached across all items
        const itemTimelines: any[][] = (activeOrder.items || []).map((it: any) => it.timeline || []);
        // Use order-level timeline, or build from status
        const orderTimeline: any[] = activeOrder.timeline || [];
        if (orderTimeline.length > 0) return orderTimeline;
        // Build from order.status
        const statusIdx = ALL_STATUSES.indexOf(activeOrder.status || "pending");
        return ALL_STATUSES.map((s, i) => ({
          status: s,
          desc: STATUS_DESCS[s],
          timestamp: i <= statusIdx ? (activeOrder.createdAt || "") : "",
          active: i <= statusIdx,
        }));
      })()
    : [];

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <h1 className="font-display font-bold text-3xl text-text-primary mb-8 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            My Orders
          </h1>

          {orders.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-primary/60" />
              </div>
              <h2 className="font-display font-bold text-2xl text-text-primary mb-3">No orders yet</h2>
              <p className="text-text-muted text-sm max-w-sm mb-8">
                You haven&apos;t placed any orders. Browse our catalog and find something you love!
              </p>
              <Link href="/products" className="btn-primary flex items-center gap-2 px-8 py-3">
                Start Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Orders List Column */}
              <div className="lg:col-span-2 space-y-4">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <div key={order.id} className="glass-card rounded-3xl border border-border overflow-hidden bg-surface">
                      {/* Order Brief Header */}
                      <div
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-surface-2 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <Package className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-text-primary text-sm">{order.orderNumber}</p>
                            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5" suppressHydrationWarning>
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-bold text-text-primary text-sm">{formatCurrency(order.total)}</p>
                            <p className="text-xs text-text-muted mt-0.5">{order.items?.length || 0} items</p>
                          </div>
                          <span className={`badge text-xs ${order.status === "delivered" ? "badge-success" : order.status === "shipped" || order.status === "out_for_delivery" ? "badge-primary" : "bg-surface-3 text-text-secondary"}`}>
                            {STATUS_LABELS[order.status] ?? order.status?.toUpperCase()}
                          </span>
                          <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </div>

                      {/* Order Detail (Collapsible) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-border bg-surface-2/50"
                          >
                            <div className="p-6 space-y-6">
                              {/* Items Section */}
                              <div className="space-y-4">
                                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Items Ordered</p>
                                {(order.items || []).map((item: any, idx: number) => {
                                  // Per-item tracking
                                  const itemTimeline: any[] = item.timeline || [];
                                  const itemStatusIdx = itemTimeline.length > 0
                                    ? itemTimeline.filter((t: any) => t.active).length - 1
                                    : ALL_STATUSES.indexOf(order.status || "pending");
                                  const currentItemStatus = itemTimeline.length > 0
                                    ? (itemTimeline.filter((t: any) => t.active).pop()?.status ?? "pending")
                                    : (order.status || "pending");

                                  return (
                                    <div key={idx} className="flex gap-4 items-start">
                                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-3 flex-shrink-0">
                                        {item.img && <img src={item.img} alt="" className="w-full h-full object-cover" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-text-primary text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-text-muted mt-1">Qty: {item.qty} · {formatCurrency(item.price)} each</p>
                                        {/* Per-item status chip */}
                                        <span className={`inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                          currentItemStatus === "delivered" ? "bg-success/10 border-success/20 text-success" :
                                          currentItemStatus === "shipped" || currentItemStatus === "out_for_delivery" ? "bg-primary/10 border-primary/20 text-primary" :
                                          "bg-surface-3 border-border text-text-muted"
                                        }`}>
                                          <Truck className="w-3 h-3" />
                                          {STATUS_LABELS[currentItemStatus] ?? currentItemStatus.toUpperCase()}
                                        </span>
                                        {item.sellerId && (
                                          <p className="text-[10px] text-text-muted mt-0.5">Seller ID: {item.sellerId}</p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Shipping Details */}
                              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                                <div>
                                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Delivery Address</p>
                                  <p className="text-text-secondary text-sm flex items-start gap-1.5">
                                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{order.address || "Address not provided"}</span>
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Carrier Tracking</p>
                                  {order.trackingNumber ? (
                                    <div className="space-y-1">
                                      <p className="text-sm font-semibold text-text-primary">Delhivery Express</p>
                                      <p className="text-xs text-text-muted">Tracking ID: {order.trackingNumber}</p>
                                    </div>
                                  ) : (
                                    <p className="text-text-muted text-sm">Not shipped yet</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Live Order Tracking Timeline Sidebar */}
              <div className="space-y-6">
                <div className="glass-card rounded-3xl border border-border p-6 space-y-6 bg-surface sticky top-28">
                  <div className="flex items-center gap-2 border-b border-border pb-4">
                    <Truck className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-lg text-text-primary">Live Tracking</h3>
                  </div>

                  {activeOrder ? (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <span>Active Order</span>
                          <span className="font-mono font-bold text-text-primary">{activeOrder.orderNumber}</span>
                        </div>
                        {activeOrder.trackingNumber && (
                          <div className="flex items-center justify-between text-xs text-text-muted">
                            <span>Carrier Code</span>
                            <span className="font-semibold text-text-primary">{activeOrder.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Per-item tracking if multiple items */}
                      {activeOrder.items?.length > 1 && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Per-Item Status</p>
                          {activeOrder.items.map((item: any, i: number) => {
                            const itemTimeline: any[] = item.timeline || [];
                            const currentStatus = itemTimeline.length > 0
                              ? (itemTimeline.filter((t: any) => t.active).pop()?.status ?? "pending")
                              : (activeOrder.status || "pending");
                            return (
                              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-surface-2 border border-border">
                                {item.img && <img src={item.img} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-semibold text-text-primary truncate">{item.name}</p>
                                  <p className={`text-[10px] font-bold ${currentStatus === "delivered" ? "text-success" : "text-primary"}`}>
                                    {STATUS_LABELS[currentStatus] ?? currentStatus.toUpperCase()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="space-y-6 relative pl-6 border-l border-border mt-4">
                        {trackingTimeline.map((point: any, idx: number) => (
                          <div key={idx} className="relative">
                            <div
                              className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                                point.active
                                  ? "bg-primary border-primary glow-primary"
                                  : "bg-surface border-border"
                              }`}
                            />
                            <div className="space-y-1">
                              <p className={`text-xs font-bold ${point.active ? "text-text-primary" : "text-text-muted"}`}>
                                {STATUS_LABELS[point.status] ?? point.status?.toUpperCase()}
                              </p>
                              <p className="text-xs text-text-muted leading-relaxed">{point.desc}</p>
                              {point.timestamp && (
                                <p className="text-[10px] text-primary flex items-center gap-1" suppressHydrationWarning>
                                  <Clock className="w-3 h-3" />
                                  {new Date(point.timestamp).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
                        <span className="flex items-center gap-1.5 text-success font-medium">
                          <ShieldCheck className="w-4 h-4 text-success" />
                          Insured shipment
                        </span>
                        <a href="#" className="text-primary hover:underline font-semibold">Need Help?</a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-text-muted text-sm">
                      Select an order to see tracking details
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
