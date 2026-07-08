"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Zap, Eye, TrendingUp } from "lucide-react";
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
    setTimeout(() => setAddedToCart(false), 2000);
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
        <Link href={`/products/${product.slug}`} className="flex gap-4 p-4 rounded-2xl card hover:border-primary/30 group">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-surface-2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted font-medium">{product.brand}</p>
            <h3 className="font-semibold text-text-primary text-sm line-clamp-2 mt-0.5 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span className="text-xs text-text-muted">{product.rating} ({product.reviewCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-text-primary">{formatCurrency(product.price)}</span>
              {discount > 0 && (
                <span className="text-xs text-success font-medium">{discount}% off</span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="product-card group relative"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative bg-surface border border-border rounded-2xl overflow-hidden">
          {/* Image */}
          <div className="product-image relative aspect-square overflow-hidden bg-surface-2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && (
                <span className="badge badge-primary text-[10px] px-2 py-0.5">NEW</span>
              )}
              {product.isBestSeller && (
                <span className="flex items-center gap-1 badge badge-warning text-[10px] px-2 py-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  BESTSELLER
                </span>
              )}
              {product.isFlashSale && (
                <span className="flex items-center gap-1 badge badge-danger text-[10px] px-2 py-0.5 animate-pulse">
                  <Zap className="w-2.5 h-2.5" />
                  FLASH SALE
                </span>
              )}
            </div>

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-danger flex items-center justify-center">
                <span className="text-white text-[10px] font-bold text-center leading-none">
                  -{discount}%
                </span>
              </div>
            )}

            {/* Overlay Actions */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-3 bottom-3 flex gap-2"
            >
              <button
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all",
                  addedToCart
                    ? "bg-success text-white"
                    : "bg-primary text-white hover:bg-primary-dark"
                )}
              >
                <ShoppingCart className="w-4 h-4" />
                {addedToCart ? "Added!" : "Add to Cart"}
              </button>
              <button
                className="w-10 h-10 rounded-xl bg-surface/90 backdrop-blur-sm flex items-center justify-center border border-border hover:border-primary/30 transition-all"
                title="Quick view"
              >
                <Eye className="w-4 h-4 text-text-secondary" />
              </button>
            </motion.div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={cn(
                "absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
                discount > 0 ? "top-[52px]" : "top-3",
                wishlisted
                  ? "bg-danger text-white"
                  : "bg-surface/80 backdrop-blur-sm text-text-muted hover:text-danger"
              )}
            >
              <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h3 className="font-semibold text-text-primary text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-3 h-3",
                      star <= Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : star - 0.5 <= product.rating
                        ? "fill-accent/50 text-accent"
                        : "fill-border text-border"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-text-muted">
                {product.rating} ({product.reviewCount.toLocaleString()})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-3">
              <span className="font-bold text-text-primary text-base">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-text-muted line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-success">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Stock & Delivery */}
            <div className="flex items-center justify-between mt-2">
              <span className={cn(
                "text-xs font-medium",
                product.stock < 10 ? "text-danger" : "text-success"
              )}>
                {product.stock < 10
                  ? `Only ${product.stock} left!`
                  : "In Stock"}
              </span>
              <span className="text-xs text-text-muted">{product.estimatedDelivery}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
