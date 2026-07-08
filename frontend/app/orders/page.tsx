"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Calendar, Truck, CheckCircle2, ChevronRight,
  ChevronDown, Search, ArrowRight, ShieldCheck, MapPin, Clock
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { formatCurrency } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const mockOrders = [
  {
    id: "o1",
    orderNumber: "NEX-897451",
    createdAt: "2026-07-06T14:30:00Z",
    total: 189900,
    status: "shipped" as OrderStatus,
    items: [
      { name: "Apple MacBook Pro 14\" M3 Pro", qty: 1, price: 189900, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=90" }
    ],
    address: "123 Technology Park, Outer Ring Road, Bangalore, Karnataka, 560103",
    trackingNumber: "DEL-84729104",
    timeline: [
      { status: "pending", timestamp: "2026-07-06T14:30:00Z", desc: "Order placed by customer", active: true },
      { status: "confirmed", timestamp: "2026-07-06T16:00:00Z", desc: "Payment verified, order confirmed", active: true },
      { status: "processing", timestamp: "2026-07-07T09:00:00Z", desc: "Picked & packed at warehouse", active: true },
      { status: "shipped", timestamp: "2026-07-07T18:30:00Z", desc: "In transit - Bengaluru Hub to Koramangala Delivery Hub", active: true },
      { status: "out_for_delivery", timestamp: "", desc: "Out for delivery", active: false },
      { status: "delivered", timestamp: "", desc: "Delivered", active: false },
    ],
  },
  {
    id: "o2",
    orderNumber: "NEX-289415",
    createdAt: "2026-06-15T11:00:00Z",
    total: 36985,
    status: "delivered" as OrderStatus,
    items: [
      { name: "Sony WH-1000XM5 Wireless Headphones", qty: 1, price: 24990, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=90" },
      { name: "Nike Air Max 270 Running Shoes", qty: 1, price: 11995, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=90" },
    ],
    address: "123 Technology Park, Outer Ring Road, Bangalore, Karnataka, 560103",
    trackingNumber: "DEL-73820194",
    timeline: [
      { status: "pending", timestamp: "2026-06-15T11:00:00Z", desc: "Order placed by customer", active: true },
      { status: "delivered", timestamp: "2026-06-17T15:45:00Z", desc: "Handed over to customer", active: true },
    ],
  },
];

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>("o1");

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

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Orders List Column */}
            <div className="lg:col-span-2 space-y-4">
              {mockOrders.map((order) => {
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
                          <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold text-text-primary text-sm">{formatCurrency(order.total)}</p>
                          <p className="text-xs text-text-muted mt-0.5">{order.items.length} items</p>
                        </div>
                        <span
                          className={`badge text-xs ${
                            order.status === "delivered" ? "badge-success" : "badge-primary"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-text-muted transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
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
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-3 flex-shrink-0">
                                    <img src={item.img} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-text-primary text-sm truncate">{item.name}</p>
                                    <p className="text-xs text-text-muted mt-1">Qty: {item.qty} · {formatCurrency(item.price)} each</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Shipping Details */}
                            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                              <div>
                                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Delivery Address</p>
                                <p className="text-text-secondary text-sm flex items-start gap-1.5">
                                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{order.address}</span>
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Active Order</span>
                    <span className="font-mono font-bold text-text-primary">NEX-897451</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>Carrier Code</span>
                    <span className="font-semibold text-text-primary">DEL-84729104</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6 relative pl-6 border-l border-border mt-4">
                  {mockOrders[0].timeline.map((point, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                          point.active
                            ? "bg-primary border-primary glow-primary"
                            : "bg-surface border-border"
                        }`}
                      />
                      
                      <div className="space-y-1">
                        <p
                          className={`text-xs font-bold ${
                            point.active ? "text-text-primary" : "text-text-muted"
                          }`}
                        >
                          {point.status.toUpperCase()}
                        </p>
                        <p className="text-xs text-text-muted leading-relaxed">{point.desc}</p>
                        {point.timestamp && (
                          <p className="text-[10px] text-primary flex items-center gap-1">
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

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
