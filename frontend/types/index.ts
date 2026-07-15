// ─── Product Types ──────────────────────────────────────────────────
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discount: number;
  currency: string;
  images: string[];
  video?: string;
  category: Category;
  subcategory?: string;
  brand: string;
  seller: Seller;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  tags: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleEndsAt?: string;
  isBestSeller: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  returnPolicy: string;
  warranty?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  color: string;
  productCount: number;
  parent?: string;
}

export interface Seller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  verified: boolean;
  totalSales: number;
  joinedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  title: string;
  body: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
  createdAt: string;
}

export interface PriceHistory {
  date: string;
  price: number;
}

// ─── Cart Types ──────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
}

// ─── User Types ───────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: "customer" | "seller" | "admin" | "support" | "seller-pending";
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  loyaltyPoints: number;
  membershipLevel: "bronze" | "silver" | "gold" | "platinum";
  createdAt: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

// ─── Order Types ──────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded";

export interface Order {
  id: string;
  orderNumber: string;
  user: User;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

// ─── AI Types ─────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  timestamp: string;
  isLoading?: boolean;
}

export interface AIRecommendation {
  product: Product;
  reason: string;
  score: number;
}

// ─── Dashboard Types ──────────────────────────────────────────────────
export interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  changeType: "increase" | "decrease";
  prefix?: string;
  suffix?: string;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface TopProduct {
  product: Product;
  sales: number;
  revenue: number;
  growth: number;
}

export interface TopSeller {
  seller: Seller;
  revenue: number;
  orders: number;
  rating: number;
}

// ─── Filter Types ─────────────────────────────────────────────────────
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  rating?: number;
  inStock?: boolean;
  isFlashSale?: boolean;
  sort?: "relevance" | "price_low" | "price_high" | "rating" | "newest" | "best_seller";
}

// ─── Notification Types ───────────────────────────────────────────────
export interface Notification {
  id: string;
  type: "order" | "shipping" | "promo" | "review" | "wishlist" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// ─── Wishlist Types ───────────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
  priceAtAdd: number;
}

// ─── Search Types ─────────────────────────────────────────────────────
export interface SearchResult {
  products: Product[];
  total: number;
  suggestions: string[];
  popularSearches: string[];
  categories: Category[];
}

export interface SearchSuggestion {
  query: string;
  type: "product" | "category" | "brand" | "popular";
}
