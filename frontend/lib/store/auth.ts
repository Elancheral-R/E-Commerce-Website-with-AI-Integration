import { create } from "zustand";

// ─── Cookie Helpers for Middleware ───────────────────────────────────
function setAuthCookies(isAuthenticated: boolean, role: string) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `nexmart-auth-status=${isAuthenticated}; path=/; expires=${expires}; SameSite=Lax`;
  document.cookie = `nexmart-auth-role=${role}; path=/; expires=${expires}; SameSite=Lax`;
}

// ─── Cart Helpers ─────────────────────────────────────────────────────
function clearCart() {
  if (typeof window === "undefined") return;
  // Clear the Zustand-persisted cart store and any ephemeral cart data
  localStorage.removeItem("nexmart-cart");
  localStorage.removeItem("nexmart-cart-guest");
}

function clearAuthCookies() {
  if (typeof document === "undefined") return;
  document.cookie = "nexmart-auth-status=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "nexmart-auth-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
import { persist } from "zustand/middleware";
import type { User } from "@/types";

// ─── Local Users Database ────────────────────────────────────────────
// This persists in localStorage to simulate a real user DB when the backend is offline.
// The default admin account is always seeded here.

interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // plain text for client-side demo
  role: "customer" | "seller" | "admin";
  membershipLevel: "bronze" | "silver" | "gold" | "platinum";
  loyaltyPoints: number;
  createdAt: string;
}

const DEFAULT_ADMIN: StoredUser = {
  id: "admin-001",
  email: "admin@nexmart.com",
  name: "System Admin",
  passwordHash: "admin123",
  role: "admin",
  membershipLevel: "platinum",
  loyaltyPoints: 9999,
  createdAt: "2024-01-01T00:00:00.000Z",
};

// ─── Auth Store ────────────────────────────────────────────────────────

interface UsersDB {
  users: StoredUser[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;

  /** Real login: first tries backend, falls back to local users DB */
  loginWithCredentials: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;

  /** Register a new user in the local DB (and backend if available) */
  registerUser: (
    name: string,
    email: string,
    password: string,
    role?: "customer" | "seller"
  ) => Promise<{ success: boolean; error?: string }>;
}

// Helper: load local users DB from localStorage
function getLocalUsers(): StoredUser[] {
  if (typeof window === "undefined") return [DEFAULT_ADMIN];
  try {
    const raw = localStorage.getItem("nexmart-users-db");
    const users: StoredUser[] = raw ? JSON.parse(raw) : [];
    // Always ensure admin exists
    if (!users.find((u) => u.email === DEFAULT_ADMIN.email)) {
      users.unshift(DEFAULT_ADMIN);
      localStorage.setItem("nexmart-users-db", JSON.stringify(users));
    }
    return users;
  } catch {
    return [DEFAULT_ADMIN];
  }
}

function saveLocalUsers(users: StoredUser[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("nexmart-users-db", JSON.stringify(users));
}

function storedUserToUser(s: StoredUser): User {
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    role: s.role,
    membershipLevel: s.membershipLevel,
    loyaltyPoints: s.loyaltyPoints,
    isEmailVerified: true,
    isTwoFactorEnabled: false,
    createdAt: s.createdAt,
    addresses: [],
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),

      login: (user, token) => {
        setAuthCookies(true, user.role);
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        clearAuthCookies();
        clearCart();
        set({ user: null, token: null, isAuthenticated: false });
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      loginWithCredentials: async (email, password) => {
        set({ isLoading: true });

        // 1. Try backend auth-service first
        try {
          const res = await fetch("http://localhost:8081/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            signal: AbortSignal.timeout(3000),
          });

          if (res.ok) {
            const data = await res.json();
            const user: User = {
              id: data.userId || data.id || `u-${Date.now()}`,
              email: data.email || email,
              name: data.name || email.split("@")[0],
              role: data.role || "customer",
              membershipLevel: data.membershipLevel || "bronze",
              loyaltyPoints: data.loyaltyPoints || 0,
              isEmailVerified: true,
              isTwoFactorEnabled: false,
              createdAt: data.createdAt || new Date().toISOString(),
              addresses: data.addresses || [],
            };
            setAuthCookies(true, user.role);
            clearCart();
            set({ user, token: data.accessToken || data.token || "jwt-token", isAuthenticated: true, isLoading: false });
            return { success: true };
          }

          if (res.status === 401) {
            set({ isLoading: false });
            return { success: false, error: "Invalid email or password." };
          }
          if (res.status === 404) {
            set({ isLoading: false });
            return { success: false, error: "Account not found. Please register first." };
          }
        } catch {
          // Backend unavailable — fall through to local DB
        }

        // 2. Fallback: check local users DB
        const users = getLocalUsers();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!found) {
          set({ isLoading: false });
          return { success: false, error: "Account not found. Please register first." };
        }

        if (found.passwordHash !== password) {
          set({ isLoading: false });
          return { success: false, error: "Incorrect password. Please try again." };
        }

        const user = storedUserToUser(found);
        setAuthCookies(true, found.role);
        clearCart();
        set({
          user,
          token: `local-jwt-${found.id}`,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      },

      registerUser: async (name, email, password, role: "customer" | "seller" = "customer") => {
        set({ isLoading: true });

        // 1. Try backend
        try {
          const res = await fetch("http://localhost:8081/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
            signal: AbortSignal.timeout(3000),
          });

          if (res.ok) {
            const data = await res.json();
            const user: User = {
              id: data.userId || data.id || `u-${Date.now()}`,
              email: data.email || email,
              name: data.name || name,
              role: data.role || role,
              membershipLevel: "bronze",
              loyaltyPoints: 0,
              isEmailVerified: false,
              isTwoFactorEnabled: false,
              createdAt: new Date().toISOString(),
              addresses: [],
            };
            setAuthCookies(true, data.role || role);
            clearCart();
            set({ user, token: data.accessToken || data.token || "jwt-token", isAuthenticated: true, isLoading: false });
            return { success: true };
          }

          if (res.status === 409) {
            set({ isLoading: false });
            return { success: false, error: "Email already registered. Please sign in." };
          }
        } catch {
          // Backend unavailable — use local DB
        }

        // 2. Fallback: register in local DB
        const users = getLocalUsers();
        const exists = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) {
          set({ isLoading: false });
          return { success: false, error: "Email already registered. Please sign in." };
        }

        const newUser: StoredUser = {
          id: `u-${Date.now()}`,
          email,
          name,
          passwordHash: password,
          role,
          membershipLevel: "bronze",
          loyaltyPoints: 0,
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        saveLocalUsers(users);

        const user = storedUserToUser(newUser);
        setAuthCookies(true, role);
        clearCart();
        set({
          user,
          token: `local-jwt-${newUser.id}`,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      },
    }),
    {
      name: "nexmart-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
