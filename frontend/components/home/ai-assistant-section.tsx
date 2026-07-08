"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, MessageSquare, Send, Bot, User, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { mockProducts } from "@/lib/mock-data";

const aiExamples = [
  { query: "Gaming laptop under ₹90,000", category: "electronics" },
  { query: "Running shoes for marathon training", category: "sports" },
  { query: "Birthday gift for a software engineer", category: "electronics" },
  { query: "Best noise canceling headphones", category: "electronics" },
];

const demoMessages = [
  { role: "user" as const, text: "I need a gaming laptop under ₹90,000" },
  {
    role: "ai" as const,
    text: "I found some excellent gaming laptops within your budget! Here are my top picks based on performance, build quality, and value:",
    products: mockProducts.filter((p) => p.category.id === "1").slice(0, 2),
  },
];

export function AIAssistantSection() {
  const [activeExample, setActiveExample] = useState(0);
  const [input, setInput] = useState("");

  return (
    <section className="py-20 bg-gradient-to-b from-background to-surface-2 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Chat window */}
            <div className="glass-card rounded-3xl border border-primary/20 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">NexMart AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-text-muted">Online · Ready to help</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-danger" />
                  <span className="w-3 h-3 rounded-full bg-warning" />
                  <span className="w-3 h-3 rounded-full bg-success" />
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-4 min-h-[300px]">
                {/* Welcome */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="chat-bubble-ai px-4 py-3 max-w-xs">
                    <p className="text-sm">
                      👋 Hi! I&apos;m your AI shopping assistant. Tell me what you&apos;re looking for and I&apos;ll find the perfect products for you!
                    </p>
                  </div>
                </div>

                {/* Example query */}
                <div className="flex gap-3 justify-end">
                  <div className="chat-bubble-user px-4 py-3 max-w-xs">
                    <p className="text-sm">
                      {aiExamples[activeExample].query}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-text-secondary" />
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-3 max-w-xs">
                    <div className="chat-bubble-ai px-4 py-3">
                      <p className="text-sm">
                        I found some excellent options! Here are my top picks based on performance and value:
                      </p>
                    </div>
                    {/* Mini product card */}
                    <div className="bg-surface-2 border border-border rounded-xl p-3 flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={mockProducts[0].images[0]}
                          alt={mockProducts[0].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary line-clamp-2">
                          {mockProducts[0].name}
                        </p>
                        <p className="text-sm font-bold text-primary mt-1">
                          ₹{mockProducts[0].price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-surface-2 rounded-full px-4 py-2.5 border border-border">
                    <input
                      type="text"
                      placeholder="Ask AI to find products..."
                      className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      id="ai-chat-input"
                    />
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <button className="w-10 h-10 rounded-full btn-primary flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick examples */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {aiExamples.slice(0, 2).map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveExample(i)}
                      className="text-xs px-3 py-1.5 rounded-full bg-surface-3 hover:bg-primary/20 hover:text-primary text-text-muted transition-all"
                    >
                      {ex.query.slice(0, 25)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 glass-card border border-border rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Conversion Rate</p>
                  <p className="font-bold text-text-primary">3.8x Higher</p>
                  <p className="text-[10px] text-success">vs traditional search</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Gemini AI
            </div>

            <h2 className="font-display font-bold text-4xl lg:text-5xl text-text-primary mb-6 leading-tight">
              Your Personal
              <br />
              <span className="gradient-text">AI Shopping</span>
              <br />
              Assistant
            </h2>

            <p className="text-text-muted text-lg leading-relaxed mb-8">
              Simply describe what you need in plain language, and our AI understands context, 
              budget, preferences, and use case to surface the most relevant products.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {[
                { icon: "🎯", title: "Context-aware Search", desc: "Understands budget, use case, and preferences" },
                { icon: "🔮", title: "Predictive Recommendations", desc: "Learns from your behavior to suggest products" },
                { icon: "💬", title: "Natural Language Input", desc: "Talk to AI like you would to a friend" },
                { icon: "⚡", title: "Instant Results", desc: "Get curated recommendations in milliseconds" },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-2 transition-colors group">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {feature.title}
                    </p>
                    <p className="text-text-muted text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/ai-assistant"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base"
            >
              <Sparkles className="w-5 h-5" />
              Try AI Assistant Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
