import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FlashSaleSection } from "@/components/home/flash-sale-section";
import { BestSellersSection } from "@/components/home/best-sellers-section";
import { AIAssistantSection } from "@/components/home/ai-assistant-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexMart — AI-Powered Smart Commerce Platform",
  description:
    "Shop 5M+ products with AI-powered search, personalized recommendations, dynamic pricing, and lightning-fast delivery. Experience the future of online shopping.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <CartDrawer />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FlashSaleSection />
        <AIAssistantSection />
        <BestSellersSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
