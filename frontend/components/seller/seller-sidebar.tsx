"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Boxes, ShoppingBag, BarChart3,
  User, Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, Store, Zap, ExternalLink, AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/seller/products", icon: Package },
  { label: "Inventory", href: "/seller/inventory", icon: Boxes },
  { label: "Orders", href: "/seller/orders", icon: ShoppingBag, notifKey: true },
  { label: "Analytics", href: "/seller/analytics", icon: BarChart3 },
  { label: "Profile", href: "/seller/profile", icon: User },
];

interface SellerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SellerSidebar({ collapsed, onToggle }: SellerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [unreadOrders, setUnreadOrders] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    // Unread seller notifications
    const notifs: any[] = JSON.parse(localStorage.getItem(`nexmart-seller-notifications-${user.id}`) || "[]");
    setUnreadOrders(notifs.filter((n) => !n.read).length);
    // Low stock products
    const prods: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    const myProds = prods.filter((p) => p.seller?.id === user.id);
    setLowStockCount(myProds.filter((p) => (p.stock || 0) < 10).length);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-full bg-surface border-r border-border shadow-xl z-20 overflow-hidden"
    >
      {/* Header / Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border", collapsed && "justify-center px-2")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-lg">
          <Store className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
              className="min-w-0"
            >
              <p className="font-display font-black text-sm text-text-primary truncate">Seller Hub</p>
              <p className="text-[10px] text-text-muted font-semibold truncate">{user?.name || "Seller"}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Low Stock Warning Banner */}
      {!collapsed && lowStockCount > 0 && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-2 text-[10px] text-warning font-bold">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {lowStockCount} product{lowStockCount > 1 ? "s" : ""} running low on stock
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {/* Notification Badge */}
              {item.notifKey && unreadOrders > 0 && (
                <span className={cn(
                  "absolute flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[8px] font-black text-white rounded-full bg-danger shadow",
                  collapsed ? "top-1 right-1" : "ml-auto"
                )}>
                  {unreadOrders > 9 ? "9+" : unreadOrders}
                </span>
              )}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn("text-sm font-semibold truncate flex-1", isActive ? "text-white" : "")}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.notifKey && unreadOrders > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 text-[9px] font-black text-white rounded-full bg-danger flex items-center justify-center ml-auto">
                  {unreadOrders > 9 ? "9+" : unreadOrders}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-border pt-3">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "View Store" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-all text-sm font-semibold",
            collapsed && "justify-center px-2"
          )}
        >
          <ExternalLink className="w-4.5 h-4.5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                View Store
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-danger hover:bg-danger/8 transition-all text-sm font-semibold",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface border border-border shadow-md flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 transition-all z-30"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
