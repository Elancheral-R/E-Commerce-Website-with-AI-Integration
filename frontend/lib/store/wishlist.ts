import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem, Product } from "@/types";

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        if (get().isWishlisted(product.id)) return;
        set((state) => ({
          items: [
            ...state.items,
            {
              id: `wl-${product.id}`,
              product,
              addedAt: new Date().toISOString(),
              priceAtAdd: product.price,
            },
          ],
        }));
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      toggleItem: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isWishlisted: (productId) =>
        get().items.some((item) => item.product.id === productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "nexmart-wishlist" }
  )
);
