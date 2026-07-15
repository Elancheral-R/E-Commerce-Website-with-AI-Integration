"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Send, Bot, User, Mic, Zap, Brain, Target } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";

const aiFeatures = [
  {
    icon: Target,
    title: "Context-Aware Search",
    desc: "Understands budget, use case, and preferences in plain language",
    color: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: Brain,
    title: "Predictive Recommendations",
    desc: "Learns from behavior to surface products you'll love",
    color: "bg-secondary/10 text-secondary border-secondary/20",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Get curated recommendations in milliseconds, not minutes",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    icon: Sparkles,
    title: "Style Intelligence",
    desc: "Matches aesthetics, complementary products, and personal taste",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
];

const demoConversation = [
  { role: "ai" as const, text: "👋 Hi! I'm your AI shopping assistant. What are you looking for today?" },
  { role: "user" as const, text: "I need a gaming laptop under ₹90,000" },
  { role: "ai" as const, text: "Found 12 perfect matches! Here's my top pick for you:", product: mockProducts[0] },
  { role: "user" as const, text: "What about noise-cancelling headphones?" },
  { role: "ai" as const, text: "Based on your audio preferences, here's what I recommend:", product: mockProducts[2] },
];

function ChatMessage({ msg, visible }: { msg: typeof demoConversation[0], visible: boolean }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (visible && !shown) {
      const t = setTimeout(() => setShown(true), 200);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!shown) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        msg.role === "ai"
          ? "bg-primary"
          : "bg-surface-3 border border-border"
      }`}>
        {msg.role === "ai"
          ? <Bot className="w-3.5 h-3.5 text-white" />
          : <User className="w-3.5 h-3.5 text-text-secondary" />
        }
      </div>

      <div className={`flex flex-col gap-1.5 max-w-[80%] ${msg.role === "user" ? "items-end" : ""}`}>
        <div className={`rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
          msg.role === "user" 
            ? "bg-primary text-white" 
            : "bg-surface-2 text-text-primary border border-border"
        }`}>
          <p>{msg.text}</p>
        </div>

        {/* Product card in chat */}
        {msg.product && (
          <div className="bg-surface border border-border rounded-xl p-3 flex gap-3 w-full shadow-sm hover:border-primary/45 transition-colors">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0 border border-border">
              <img src={msg.product.images[0]} alt={msg.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-primary font-bold uppercase tracking-wider">{msg.product.brand}</p>
              <p className="text-xs font-semibold text-text-primary line-clamp-1 mt-0.5">{msg.product.name}</p>
              <p className="text-xs font-bold text-text-primary mt-1">₹{msg.product.price.toLocaleString("en-IN")}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function AIAssistantSection() {
  const [visibleCount, setVisibleCount] = useState(1);
  const [input, setInput] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (visibleCount >= demoConversation.length) return;
    const delay = demoConversation[visibleCount]?.role === "user" ? 1400 : 1000;
    const t = setTimeout(() => setVisibleCount(c => c + 1), delay);
    return () => clearTimeout(t);
  }, [inView, visibleCount]);

  return (
    <section ref={sectionRef} className="py-20 bg-background border-t border-b border-border relative overflow-hidden">
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Chat Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative bg-surface rounded-2xl border border-border overflow-hidden shadow-md">
              {/* Window titlebar */}
              <div className="flex items-center gap-3 p-4 border-b border-border bg-surface-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-text-primary text-sm">NexMart AI Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="live-dot w-1.5 h-1.5" />
                    <span className="text-[10px] text-text-muted">Online · Gemini Engine</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-border" />
                  <span className="w-2 h-2 rounded-full bg-border" />
                  <span className="w-2 h-2 rounded-full bg-border" />
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3.5 min-h-[340px] max-h-[400px] overflow-y-auto">
                {demoConversation.slice(0, visibleCount).map((msg, i) => (
                  <ChatMessage key={i} msg={msg} visible={i < visibleCount} />
                ))}

                {/* Typing indicator */}
                {visibleCount < demoConversation.length && demoConversation[visibleCount]?.role === "ai" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-surface-2 border border-border rounded-xl px-4 py-3 flex items-center gap-1.5">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay }}
                          className="w-1.5 h-1.5 rounded-full bg-text-muted"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-surface-2/40">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-surface rounded-xl px-4 py-2 border border-border">
                    <input
                      type="text"
                      id="ai-chat-input"
                      placeholder="Ask AI to find products..."
                      className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted outline-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <Mic className="w-4 h-4 text-text-muted" />
                  </div>
                  <button className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center p-0 shadow-sm">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            <span className="section-label inline-flex">
              <Sparkles className="w-3 h-3" />
              Powered by Gemini AI
            </span>

            <h2 className="heading-lg text-text-primary tracking-tight">
              Your Personal <span className="text-primary">AI Shopping</span> Assistant
            </h2>

            <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-md">
              Simply describe what you need. Our AI understands context, budget, preferences, and use cases to curate exactly what you are looking for in real-time.
            </p>

            {/* Features */}
            <div className="grid gap-3">
              {aiFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border bg-surface hover:border-primary/40 transition-all duration-200 group cursor-default"
                  >
                    <div className={`w-9 h-9 rounded-lg ${feature.color} flex items-center justify-center flex-shrink-0 border`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">{feature.title}</p>
                      <p className="text-text-muted text-xs mt-0.5 leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link href="/ai-assistant" className="btn-primary text-sm px-6 py-3 shadow-md">
                <Sparkles className="w-4 h-4" />
                Try AI Assistant Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
