"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, Bot, User, Mic, MicOff, Camera, ArrowLeft,
  Volume2, VolumeX, RefreshCw, Star, ShoppingCart, Info, Compass, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ProductCard } from "@/components/products/product-card";
import { mockProducts } from "@/lib/mock-data";
import { formatCurrency, getDiscountPercentage, cn } from "@/lib/utils";
import type { ChatMessage, Product } from "@/types";

const SUGGESTED_PROMPTS = [
  { text: "I need a gaming laptop under ₹90,000.", icon: "🎮" },
  { text: "Suggest birthday gifts for a software engineer.", icon: "💻" },
  { text: "I want running shoes for marathon training.", icon: "🏃" },
  { text: "Compare iPhone 15 vs Samsung S24 Ultra.", icon: "📱" },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your NexMart AI Shopping Assistant. I can help you find products, compare options, suggest gifts, or answer questions about your orders. What are you looking for today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateAIResponse = async (userQuery: string) => {
    setIsTyping(true);
    // Simulate thinking network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let responseContent = "";
    let recommendedProducts: Product[] = [];

    const query = userQuery.toLowerCase();

    if (query.includes("laptop") || query.includes("gaming") || query.includes("computer")) {
      responseContent = "I found some high-performance laptops. For gaming and intensive workloads, the Apple MacBook Pro with M3 Pro chip offers unparalleled power and efficiency. Alternatively, you might want to look at our dedicated gaming inventory. Here are the top suggestions:";
      recommendedProducts = mockProducts.filter((p) => p.tags.includes("macbook") || p.category.slug === "electronics").slice(0, 2);
    } else if (query.includes("shoe") || query.includes("run") || query.includes("marathon") || query.includes("fitness")) {
      responseContent = "For running and marathon training, cushioning and stability are essential. I highly recommend the Nike Air Max 270. It features a Max Air heel unit for high impact protection and a breathable mesh upper to keep your feet cool over long distances.";
      recommendedProducts = mockProducts.filter((p) => p.category.slug === "sports").slice(0, 2);
    } else if (query.includes("gift") || query.includes("birthday") || query.includes("software engineer")) {
      responseContent = "Here are some awesome gift ideas for a software engineer or tech enthusiast! Keyboards, high-quality ANC headphones, or a premium tablet are always excellent choices:";
      recommendedProducts = mockProducts.filter((p) => p.brand === "Sony" || p.brand === "Apple" || p.brand === "Amazon").slice(0, 3);
    } else if (query.includes("headphone") || query.includes("audio") || query.includes("music") || query.includes("sound")) {
      responseContent = "For the ultimate audio experience, the Sony WH-1000XM5 wireless noise-canceling headphones are unmatched. They offer industry-leading active noise cancellation, 30 hours of battery life, and high-resolution sound.";
      recommendedProducts = mockProducts.filter((p) => p.id === "p3");
    } else {
      responseContent = "I found some of our featured top-rated products that you might love! Let me know if you want to narrow down by category, budget, or specific specifications.";
      recommendedProducts = mockProducts.filter((p) => p.isFeatured).slice(0, 2);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        products: recommendedProducts,
        timestamp: new Date().toISOString(),
      },
    ]);
    setIsTyping(false);
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    simulateAIResponse(textToSend);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate speech recognition
      setTimeout(() => {
        setInput("I need a gaming laptop under ₹90,000.");
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="min-h-screen bg-background pt-24 pb-12 flex flex-col">
        <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-6 grid lg:grid-cols-4 gap-8">
          
          {/* Left Panel - Guidelines and Suggestions */}
          <div className="hidden lg:flex flex-col gap-6 lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 border border-border sticky top-28 space-y-6">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles className="w-5 h-5" />
                <span>AI Agent Capabilities</span>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Find products based on budget and specs
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Compare features and customer ratings
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Check order status and refund history
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">✓</span>
                  Explain return and shipping policies
                </li>
              </ul>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider mb-3">
                  <span>Suggested Prompts</span>
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-2">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p.text}
                      onClick={() => handleSend(p.text)}
                      className="w-full text-left p-3 rounded-xl bg-surface-2 border border-border text-xs text-text-secondary hover:text-primary hover:border-primary/40 transition-all flex items-start gap-2 group"
                    >
                      <span className="text-base">{p.icon}</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">{p.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Central Chat Interface */}
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-8.5rem)] relative">
            <div className="glass-card flex-1 rounded-3xl border border-border flex flex-col overflow-hidden shadow-2xl">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-text-primary text-base">NexMart Assistant</h1>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-text-muted">Active agent</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg bg-surface-3 hover:bg-surface border border-border text-text-muted hover:text-text-primary transition-all"
                    title={isMuted ? "Unmute Voice" : "Mute Voice"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setMessages([messages[0]])}
                    className="p-2 rounded-lg bg-surface-3 hover:bg-surface border border-border text-text-muted hover:text-text-primary transition-all"
                    title="Clear chat history"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Screen */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold",
                        msg.role === "user"
                          ? "bg-surface-3 border border-border text-text-secondary"
                          : "bg-gradient-to-br from-primary to-secondary text-white"
                      )}
                    >
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div className="space-y-3">
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                          msg.role === "user"
                            ? "chat-bubble-user"
                            : "chat-bubble-ai"
                        )}
                      >
                        <p>{msg.content}</p>
                      </div>

                      {/* Attached Product Cards */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {msg.products.map((product) => (
                            <div
                              key={product.id}
                              className="bg-surface border border-border rounded-2xl overflow-hidden p-3 hover:border-primary/40 transition-all flex flex-col justify-between"
                            >
                              <div className="flex gap-3">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-text-primary text-xs line-clamp-2 leading-snug">
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <Star className="w-3 h-3 fill-accent text-accent" />
                                    <span className="text-[10px] text-text-muted">
                                      {product.rating} ({product.reviewCount})
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                                <div>
                                  <span className="font-bold text-sm text-text-primary">
                                    {formatCurrency(product.price)}
                                  </span>
                                  {product.originalPrice > product.price && (
                                    <span className="text-[10px] text-text-muted line-through ml-1.5">
                                      {formatCurrency(product.originalPrice)}
                                    </span>
                                  )}
                                </div>
                                <Link
                                  href={`/products/${product.slug}`}
                                  className="text-[11px] font-semibold text-primary hover:underline"
                                >
                                  View Detail →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* AI Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="chat-bubble-ai px-4 py-3 rounded-2xl flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border bg-surface-2">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 flex items-center gap-2 bg-surface rounded-2xl border border-border px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                    
                    {/* Voice icon */}
                    <button
                      onClick={handleVoiceToggle}
                      className={cn(
                        "p-1 rounded-full text-text-muted hover:text-primary transition-all",
                        isListening && "text-danger hover:text-danger bg-danger/10 animate-pulse"
                      )}
                      title="Speak your search request"
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <input
                      type="text"
                      placeholder={isListening ? "Listening to voice query..." : "Describe what you need (e.g. Gaming laptop under 90k)..."}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      disabled={isListening}
                      className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                      id="ai-chat-input-page"
                    />

                    {/* Image Search Input */}
                    <button className="p-1 rounded-full text-text-muted hover:text-primary transition-all" title="Upload image search">
                      <Camera className="w-5 h-5" />
                    </button>
                    
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>

                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="w-12 h-12 rounded-2xl btn-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
