import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;

  // Computed
  subtotal: () => number;
  total: () => number;
  itemCount: () => number;

  // Actions
  addItem: (product: Product, quantity?: number, variant?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: "",
      couponDiscount: 0,

      subtotal: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      total: () => {
        const subtotal = get().subtotal();
        const discount = get().couponDiscount;
        const shipping = subtotal > 999 ? 0 : 99;
        return subtotal - discount + shipping;
      },
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product.id === product.id &&
              JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${Date.now()}`,
                product,
                quantity,
                selectedVariant: variant,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) })),

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: "", couponDiscount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: "", couponDiscount: 0 }),
    }),
    {
      name: "nexmart-cart",
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount }),
    }
  )
);
