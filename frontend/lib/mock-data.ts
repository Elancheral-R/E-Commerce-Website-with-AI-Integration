import type { Product, Category, Order, Review, RevenueData } from "@/types";

// ─── Categories ───────────────────────────────────────────────────────
export const mockCategories: Category[] = [
  { id: "1", name: "Electronics", slug: "electronics", icon: "💻", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80", color: "#6366f1", productCount: 15420 },
  { id: "2", name: "Fashion", slug: "fashion", icon: "👗", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80", color: "#ec4899", productCount: 28340 },
  { id: "3", name: "Home & Living", slug: "home-living", icon: "🏠", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", color: "#10b981", productCount: 12580 },
  { id: "4", name: "Sports", slug: "sports", icon: "⚽", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80", color: "#f59e0b", productCount: 8920 },
  { id: "5", name: "Books", slug: "books", icon: "📚", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80", color: "#8b5cf6", productCount: 45000 },
  { id: "6", name: "Beauty", slug: "beauty", icon: "💄", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80", color: "#f43f5e", productCount: 9340 },
  { id: "7", name: "Gaming", slug: "gaming", icon: "🎮", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80", color: "#06b6d4", productCount: 6780 },
  { id: "8", name: "Automotive", slug: "automotive", icon: "🚗", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80", color: "#64748b", productCount: 4210 },
];

// ─── Mock Seller ──────────────────────────────────────────────────────
const mockSeller = {
  id: "s1",
  name: "TechZone Official",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=TechZone",
  rating: 4.8,
  verified: true,
  totalSales: 128000,
  joinedAt: "2021-03-15",
};

// ─── Products ─────────────────────────────────────────────────────────
export const mockProducts: Product[] = [];

// ─── Mock Reviews ─────────────────────────────────────────────────────
export const mockReviews: Review[] = [
  {
    id: "r1",
    userId: "u1",
    productId: "p1",
    user: { name: "Rahul Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
    rating: 5,
    title: "Absolutely incredible machine!",
    body: "I've been using the MacBook Pro M3 Pro for three months now and it completely changed my workflow. The performance is unmatched — I can run Final Cut Pro, Xcode, and multiple apps simultaneously without any slowdown.",
    isVerifiedPurchase: true,
    helpfulCount: 234,
    createdAt: "2024-04-20T10:30:00Z",
  },
  {
    id: "r2",
    userId: "u2",
    productId: "p1",
    user: { name: "Priya Menon", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    rating: 5,
    title: "Worth every rupee",
    body: "As a software engineer, this laptop is a beast. Compiles code faster than any machine I've used. Battery life is genuinely impressive — easily get 12 hours of actual coding work.",
    isVerifiedPurchase: true,
    helpfulCount: 187,
    createdAt: "2024-05-12T14:00:00Z",
  },
];

// ─── Revenue Data ─────────────────────────────────────────────────────
export const mockRevenueData: RevenueData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    revenue: Math.floor(Math.random() * 500000 + 200000),
    orders: Math.floor(Math.random() * 500 + 200),
    visitors: Math.floor(Math.random() * 5000 + 2000),
  };
});

// ─── Flash Sale Products ──────────────────────────────────────────────
export const flashSaleProducts = mockProducts.filter((p) => p.isFlashSale);

// ─── Best Sellers ─────────────────────────────────────────────────────
export const bestSellers = mockProducts.filter((p) => p.isBestSeller);

// ─── Trending Products ─────────────────────────────────────────────────
export const trendingProducts = [...mockProducts].sort(() => Math.random() - 0.5).slice(0, 6);

// ─── Popular Searches ─────────────────────────────────────────────────
export const popularSearches = [
  "MacBook Pro", "iPhone 15", "Gaming Laptop", "Wireless Headphones",
  "Smart Watch", "Air Purifier", "Running Shoes", "4K TV",
];
