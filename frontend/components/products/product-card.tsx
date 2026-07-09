"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, Zap, Eye, TrendingUp, Check } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { formatCurrency, getDiscountPercentage, cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "horizontal";
  index?: number;
}

export function ProductCard({ product, variant = "default", index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const wishlisted = isWishlisted(product.id);
  const discount = getDiscountPercentage(product.originalPrice, product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  if (variant === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link href={`/products/${product.slug}`} className="flex gap-4 p-4 rounded-2xl card hover:border-primary/20 group">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">{product.brand}</p>
            <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mt-0.5 group-hover:text-primary transition-colors leading-snug">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs text-text-muted">{product.rating} ({product.reviewCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-text-primary">{formatCurrency(product.price)}</span>
              {discount > 0 && (
                <span className="text-xs font-bold text-success">{discount}% off</span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="product-card group relative"
    >
      <Link href={`/products/${product.slug}`}>
        <motion.div
          animate={{ y: hovered ? -6 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "relative bg-surface border rounded-2xl overflow-hidden transition-all duration-300",
            hovered
              ? "border-primary/20 shadow-[0_20px_50px_-8px_rgb(99_102_241/0.2),0_8px_20px_-4px_rgb(0_0_0/0.15)]"
              : "border-border shadow-card"
          )}
        >
          {/* Image Area */}
          <div className="product-image relative overflow-hidden bg-surface-2" style={{ aspectRatio: "1/1" }}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-600 ease-out"
              style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
            />

            {/* Image overlay gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300",
              hovered ? "opacity-100" : "opacity-0"
            )} />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <span className="badge badge-primary text-[9px] px-2 py-0.5 shadow-sm">NEW</span>
              )}
              {product.isBestSeller && (
                <span className="flex items-center gap-1 badge badge-warning text-[9px] px-2 py-0.5 shadow-sm">
                  <TrendingUp className="w-2.5 h-2.5" />
                  BESTSELLER
                </span>
              )}
              {product.isFlashSale && (
                <span className="flex items-center gap-1 badge badge-danger text-[9px] px-2 py-0.5 shadow-sm">
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  FLASH SALE
                </span>
              )}
            </div>

            {/* Discount badge — top right */}
            {discount > 0 && (
              <div className="absolute top-3 right-3 w-11 h-11 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center shadow-lg z-10">
                <span className="text-white text-[9px] font-black text-center leading-tight">-{discount}%</span>
              </div>
            )}

            {/* Wishlist — visible on hover */}
            <motion.button
              initial={false}
              animate={{
                opacity: hovered || wishlisted ? 1 : 0,
                scale: hovered || wishlisted ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              onClick={handleWishlist}
              className={cn(
                "absolute z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg",
                discount > 0 ? "top-[56px] right-3" : "top-[52px] right-3",
                wishlisted
                  ? "bg-danger text-white"
                  : "bg-surface/85 backdrop-blur-sm text-text-muted hover:text-danger hover:bg-white"
              )}
              style={{ top: discount > 0 ? "56px" : "52px" }}
            >
              <Heart
                className={cn("w-4 h-4 transition-all duration-300", wishlisted && "fill-current animate-heartbeat")}
              />
            </motion.button>

            {/* Bottom Action Bar — slides up on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
                  className="absolute inset-x-3 bottom-3 z-20 flex gap-2"
                >
                  <button
                    onClick={handleAddToCart}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg",
                      addedToCart
                        ? "bg-success text-white"
                        : "bg-primary text-white hover:bg-primary-dark"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={addedToCart ? "check" : "cart"}
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        {addedToCart ? (
                          <><Check className="w-4 h-4" /> Added!</>
                        ) : (
                          <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                  <button className="w-10 h-10 flex-shrink-0 rounded-xl bg-surface/85 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-white hover:text-primary transition-all text-text-secondary shadow-lg">
                    <Eye className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.1em] mb-1">
              {product.brand}
            </p>
            <h3 className="font-semibold text-text-primary text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-2.5">
              {product.name}
            </h3>

            {/* Rating — pill style */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                <Star className="w-2.5 h-2.5 fill-accent text-accent" />
                <span className="text-[11px] font-bold text-accent">{product.rating}</span>
              </div>
              <span className="text-[11px] text-text-muted">({product.reviewCount.toLocaleString()})</span>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display font-bold text-text-primary text-lg">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-text-muted line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="ml-auto text-xs font-bold text-success">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Stock progress bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-bold",
                  product.stock < 10 ? "text-danger" : "text-text-muted"
                )}>
                  {product.stock < 10 ? `Only ${product.stock} left!` : "In Stock"}
                </span>
                <span className="text-[10px] text-text-muted">{product.estimatedDelivery}</span>
              </div>
              {product.stock < 50 && (
                <div className="h-1 rounded-full bg-surface-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.max(15, (product.stock / 50) * 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.05 }}
                    className={cn(
                      "h-full rounded-full",
                      product.stock < 10
                        ? "bg-gradient-to-r from-danger to-orange-400"
                        : "bg-gradient-to-r from-success to-emerald-400"
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
