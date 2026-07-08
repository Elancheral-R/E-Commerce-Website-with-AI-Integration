import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  theme: "dark" | "light" | "system";
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  searchOpen: boolean;
  recentSearches: string[];
  recentlyViewed: string[];
  cookieConsent: boolean;

  setTheme: (theme: "dark" | "light" | "system") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setSearchOpen: (open: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentlyViewed: (productId: string) => void;
  acceptCookies: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "dark",
      sidebarOpen: false,
      commandPaletteOpen: false,
      searchOpen: false,
      recentSearches: [],
      recentlyViewed: [],
      cookieConsent: false,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      setSearchOpen: (open) => set({ searchOpen: open }),

      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((s) => s !== query),
          ].slice(0, 8),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      addRecentlyViewed: (productId) =>
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 20),
        })),

      acceptCookies: () => set({ cookieConsent: true }),
    }),
    {
      name: "nexmart-ui",
      partialize: (state) => ({
        theme: state.theme,
        recentSearches: state.recentSearches,
        recentlyViewed: state.recentlyViewed,
        cookieConsent: state.cookieConsent,
      }),
    }
  )
);
