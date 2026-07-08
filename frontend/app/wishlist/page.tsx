"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCartStore } from "@/lib/store/cart";
import { formatCurrency, getDiscountPercentage } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem(product);
    openCart();
  };

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-28 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h1 className="font-display font-bold text-3xl text-text-primary flex items-center gap-3">
              <Heart className="w-8 h-8 text-danger fill-danger" />
              My Wishlist
            </h1>
            {items.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm font-semibold text-danger hover:underline"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="glass-card rounded-3xl border border-border p-12 text-center max-w-xl mx-auto space-y-6">
              <div className="w-24 h-24 rounded-full bg-surface-2 flex items-center justify-center mx-auto">
                <Heart className="w-12 h-12 text-text-muted" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl text-text-primary">Your wishlist is empty</h2>
                <p className="text-text-muted mt-2">
                  Tap the heart icon on any product page to save items for later.
                </p>
              </div>
              <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5">
                Explore Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const product = item.product;
                  const discount = getDiscountPercentage(product.originalPrice, product.price);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-surface border border-border rounded-2xl overflow-hidden group hover:border-primary/30 transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-square bg-surface-2 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => removeItem(product.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-surface/85 backdrop-blur-sm text-text-muted hover:text-danger flex items-center justify-center transition-all border border-border"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <p className="text-xs text-primary font-bold uppercase tracking-wider">{product.brand}</p>
                          <Link
                            href={`/products/${product.slug}`}
                            className="font-semibold text-text-primary text-sm line-clamp-2 hover:text-primary transition-colors leading-snug"
                          >
                            {product.name}
                          </Link>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                            <span className="text-xs text-text-muted">{product.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display font-bold text-base text-text-primary">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-text-muted line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
