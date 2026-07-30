"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, Eye, EyeOff, Copy, Archive,
  Package, Star, Filter, X, Save, AlertTriangle, CheckCircle, ChevronDown,
  Image as ImageIcon, Tag,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { formatCurrency, cn } from "@/lib/utils";

const CATEGORIES = ["electronics", "fashion", "home-living", "sports", "books", "beauty", "toys", "automotive"];
const STATUS_FILTERS = ["all", "active", "pending", "archived", "out-of-stock"];

const DEFAULT_FORM = {
  name: "", brand: "", price: "", originalPrice: "", stock: "",
  category: "electronics", sku: "", description: "", imageUrl: "",
  visibility: "public", specifications: {} as Record<string, string>,
};

export default function SellerProductsPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadProducts = () => {
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    setProducts(all.filter((p) => p.seller?.id === user?.id));
  };

  useEffect(() => {
    if (user) loadProducts();
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ ...DEFAULT_FORM });
    setPanelOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingProduct(p);
    setForm({
      name: p.name || "",
      brand: p.brand || "",
      price: String(p.price || ""),
      originalPrice: String(p.originalPrice || ""),
      stock: String(p.stock || ""),
      category: typeof p.category === "object" ? p.category.slug : (p.category || "electronics"),
      sku: p.sku || "",
      description: p.description || "",
      imageUrl: p.images?.[0] || "",
      visibility: p.visibility || "public",
      specifications: p.specifications || {},
    });
    setPanelOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) {
      showToast("Please fill in Name, Price and Stock.");
      return;
    }
    setSaving(true);
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    const catName = form.category.charAt(0).toUpperCase() + form.category.slice(1).replace("-", " & ");

    if (editingProduct) {
      const updated = all.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: form.name,
              brand: form.brand,
              price: parseFloat(form.price),
              originalPrice: parseFloat(form.originalPrice || form.price),
              stock: parseInt(form.stock),
              category: { id: form.category, name: catName, slug: form.category },
              sku: form.sku,
              description: form.description,
              images: form.imageUrl ? [form.imageUrl] : p.images,
              visibility: form.visibility,
              specifications: form.specifications,
              slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            }
          : p
      );
      localStorage.setItem("nexmart-products", JSON.stringify(updated));
      showToast("Product updated successfully!");
    } else {
      const newProd = {
        id: "p-" + Date.now(),
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice || form.price),
        discount: form.originalPrice
          ? Math.round(((parseFloat(form.originalPrice) - parseFloat(form.price)) / parseFloat(form.originalPrice)) * 100)
          : 0,
        currency: "INR",
        images: form.imageUrl
          ? [form.imageUrl]
          : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=90"],
        category: { id: form.category, name: catName, slug: form.category },
        seller: {
          id: user?.id,
          name: user?.name,
          logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.name}`,
          rating: 4.8, verified: true, totalSales: 0,
          joinedAt: new Date().toISOString().split("T")[0],
        },
        rating: 5.0, reviewCount: 0,
        stock: parseInt(form.stock),
        sku: form.sku || "SKU-" + Date.now(),
        description: form.description,
        specifications: form.specifications,
        visibility: form.visibility,
        tags: [form.category, form.brand.toLowerCase()],
        isFeatured: false, isFlashSale: false, isBestSeller: false, isNew: true,
        approved: true,
        createdAt: new Date().toISOString(),
      };
      all.push(newProd);
      localStorage.setItem("nexmart-products", JSON.stringify(all));
      showToast("Product added and live!");
    }
    setTimeout(() => {
      setSaving(false);
      setPanelOpen(false);
      loadProducts();
    }, 600);
  };

  const handleDelete = (id: string) => {
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    localStorage.setItem("nexmart-products", JSON.stringify(all.filter((p) => p.id !== id)));
    setDeleteConfirm(null);
    loadProducts();
    showToast("Product deleted.");
  };

  const handleArchive = (p: any) => {
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    const updated = all.map((x) =>
      x.id === p.id ? { ...x, archived: !p.archived } : x
    );
    localStorage.setItem("nexmart-products", JSON.stringify(updated));
    loadProducts();
    showToast(p.archived ? "Product restored." : "Product archived.");
  };

  const handleDuplicate = (p: any) => {
    const all: any[] = JSON.parse(localStorage.getItem("nexmart-products") || "[]");
    const copy = {
      ...p,
      id: "p-copy-" + Date.now(),
      slug: p.slug + "-copy-" + Date.now(),
      name: p.name + " (Copy)",
      createdAt: new Date().toISOString(),
    };
    all.push(copy);
    localStorage.setItem("nexmart-products", JSON.stringify(all));
    loadProducts();
    showToast("Product duplicated.");
  };

  const addSpec = () => {
    if (!specKey) return;
    setForm((f) => ({ ...f, specifications: { ...f.specifications, [specKey]: specVal } }));
    setSpecKey(""); setSpecVal("");
  };
  const removeSpec = (key: string) => {
    const specs = { ...form.specifications };
    delete specs[key];
    setForm((f) => ({ ...f, specifications: specs }));
  };

  // Filtered products
  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true
      : filter === "active" ? (!p.archived && p.approved && p.stock > 0)
      : filter === "pending" ? !p.approved
      : filter === "archived" ? p.archived
      : filter === "out-of-stock" ? p.stock === 0
      : true;
    return matchSearch && matchFilter;
  });

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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">Catalog</p>
          <h1 className="font-display font-black text-2xl text-text-primary">Product Management</h1>
          <p className="text-text-secondary text-sm mt-1">{products.length} listings in your store</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filter + Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 relative z-10">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 flex-1">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent flex-1 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                filter === f ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:text-text-primary"
              )}
            >
              {f.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-card relative z-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-12 h-12 text-text-muted/30 mb-4" />
            <p className="font-bold text-text-primary text-base">No products found</p>
            <p className="text-text-muted text-sm mt-1">Add your first product to get started</p>
            <button onClick={openAdd} className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  {["Product", "SKU", "Category", "Price", "Stock", "Status", "Rating", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-surface-2/50 transition-colors"
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-3 flex-shrink-0">
                          <img src={p.images?.[0] || "https://placehold.co/40"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-xs truncate max-w-[160px]">{p.name}</p>
                          <p className="text-text-muted text-[10px]">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-muted font-mono">{p.sku || "—"}</td>
                    <td className="px-4 py-3 text-xs text-text-secondary capitalize">
                      {typeof p.category === "object" ? p.category?.name : p.category}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text-primary text-xs font-bold">{formatCurrency(p.price)}</p>
                      {p.originalPrice > p.price && (
                        <p className="text-text-muted text-[10px] line-through">{formatCurrency(p.originalPrice)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-lg",
                        p.stock === 0 ? "bg-danger/10 text-danger"
                        : p.stock < 10 ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                      )}>
                        {p.stock === 0 ? "Out of Stock" : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "badge text-[9px]",
                        p.archived ? "badge-secondary"
                        : !p.approved ? "badge-warning"
                        : "badge-success"
                      )}>
                        {p.archived ? "Archived" : !p.approved ? "Pending" : "Live"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="text-xs font-bold text-text-primary">{p.rating || 5.0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-surface-3 text-text-muted hover:text-primary transition-colors" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDuplicate(p)} className="p-1.5 rounded-lg hover:bg-surface-3 text-text-muted hover:text-secondary transition-colors" title="Duplicate">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleArchive(p)} className="p-1.5 rounded-lg hover:bg-surface-3 text-text-muted hover:text-warning transition-colors" title="Archive/Restore">
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl border border-border p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-danger" />
              </div>
              <h3 className="font-display font-black text-lg text-text-primary text-center mb-2">Delete Product?</h3>
              <p className="text-text-muted text-sm text-center mb-6">This action cannot be undone. The product will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-border text-text-secondary font-bold text-sm hover:border-primary/30 transition-all">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-danger text-white font-bold text-sm hover:bg-danger/80 transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Panel */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40" onClick={() => setPanelOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-surface border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display font-black text-lg text-text-primary">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setPanelOpen(false)} className="p-2 rounded-xl hover:bg-surface-2 text-text-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Basic Info */}
                <div className="space-y-4">
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Basic Information</p>
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted">Product Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input border-border rounded-xl text-sm text-text-primary w-full" placeholder="iPhone 15 Pro Max" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted">Brand *</label>
                        <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                          className="input border-border rounded-xl text-sm text-text-primary w-full" placeholder="Apple" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted">SKU</label>
                        <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                          className="input border-border rounded-xl text-sm text-text-primary w-full" placeholder="APL-001" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="input border-border rounded-xl text-sm text-text-primary w-full">
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace("-", " & ")}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted">Description</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="input border-border rounded-xl text-sm text-text-primary w-full h-24 resize-none" placeholder="Product description..." />
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="space-y-4">
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Pricing & Inventory</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted">Selling Price *</label>
                      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="input border-border rounded-xl text-sm text-text-primary w-full" placeholder="999" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted">MRP (Original)</label>
                      <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                        className="input border-border rounded-xl text-sm text-text-primary w-full" placeholder="1299" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-muted">Stock Units *</label>
                      <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className="input border-border rounded-xl text-sm text-text-primary w-full" placeholder="100" />
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-3">
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Product Image</p>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="input border-border rounded-xl text-sm text-text-primary w-full" placeholder="https://example.com/image.jpg" />
                  {form.imageUrl && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-border">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Specifications */}
                <div className="space-y-3">
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Specifications</p>
                  <div className="flex gap-2">
                    <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="e.g. Color"
                      className="input border-border rounded-xl text-sm text-text-primary flex-1" />
                    <input value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="e.g. Black"
                      className="input border-border rounded-xl text-sm text-text-primary flex-1" />
                    <button onClick={addSpec} className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/80 transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {Object.entries(form.specifications).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs">
                      <span className="text-text-muted font-semibold">{k}</span>
                      <span className="text-text-primary font-bold">{String(v)}</span>
                      <button onClick={() => removeSpec(k)} className="text-danger hover:text-danger/70 ml-2"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>

                {/* Visibility */}
                <div className="space-y-3">
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Visibility</p>
                  <div className="flex gap-3">
                    {["public", "private"].map((v) => (
                      <button key={v} onClick={() => setForm({ ...form, visibility: v })}
                        className={cn("flex-1 py-2.5 rounded-xl border font-bold text-sm capitalize transition-all",
                          form.visibility === v ? "border-primary bg-primary/5 text-primary" : "border-border text-text-muted")}>
                        {v === "public" ? <><Eye className="w-4 h-4 inline mr-1.5" />Public</> : <><EyeOff className="w-4 h-4 inline mr-1.5" />Private</>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Footer */}
              <div className="p-6 border-t border-border flex gap-3">
                <button onClick={() => setPanelOpen(false)} className="flex-1 py-3 rounded-xl border border-border text-text-secondary font-bold text-sm hover:border-primary/30 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60">
                  {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> {editingProduct ? "Save Changes" : "Add Product"}</>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
