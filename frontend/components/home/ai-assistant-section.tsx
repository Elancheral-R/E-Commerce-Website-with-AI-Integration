"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Send, Bot, User, TrendingUp, Mic, Zap, Brain, Target } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";

const aiFeatures = [
  {
    icon: Target,
    title: "Context-Aware Search",
    desc: "Understands budget, use case, and preferences in plain language",
    color: "from-primary to-secondary",
  },
  {
    icon: Brain,
    title: "Predictive Recommendations",
    desc: "Learns from behavior to surface products you'll love",
    color: "from-secondary to-purple-600",
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Get curated recommendations in milliseconds, not minutes",
    color: "from-electric to-cyan-400",
  },
  {
    icon: Sparkles,
    title: "Style Intelligence",
    desc: "Matches aesthetics, complementary products, and personal taste",
    color: "from-pink-500 to-rose-500",
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
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        msg.role === "ai"
          ? "bg-gradient-to-br from-primary to-secondary"
          : "bg-surface-3 border border-border"
      }`}>
        {msg.role === "ai"
          ? <Bot className="w-3.5 h-3.5 text-white" />
          : <User className="w-3.5 h-3.5 text-text-secondary" />
        }
      </div>

      <div className={`flex flex-col gap-2 max-w-[75%] ${msg.role === "user" ? "items-end" : ""}`}>
        <div className={msg.role === "user" ? "chat-bubble-user px-3.5 py-2.5" : "chat-bubble-ai px-3.5 py-2.5"}>
          <p className="text-xs leading-relaxed">{msg.text}</p>
        </div>

        {/* Product card in chat */}
        {msg.product && (
          <div className="bg-surface border border-border rounded-xl p-3 flex gap-3 w-full shadow-card">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-2 flex-shrink-0">
              <img src={msg.product.images[0]} alt={msg.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-primary font-black uppercase tracking-wider">{msg.product.brand}</p>
              <p className="text-xs font-semibold text-text-primary line-clamp-2 mt-0.5">{msg.product.name}</p>
              <p className="text-sm font-bold text-primary mt-1">₹{msg.product.price.toLocaleString("en-IN")}</p>
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
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Full dark background with neural effect */}
      <div className="absolute inset-0 bg-[#06060a]" />

      {/* Neural network orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "600px", height: "600px",
          background: "radial-gradient(circle, rgb(99 102 241 / 0.25) 0%, transparent 65%)",
          top: "-100px", left: "-100px",
        }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 3 }}
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgb(59 130 246 / 0.2) 0%, transparent 65%)",
          bottom: "-100px", right: "0",
        }}
      />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            {/* Glow behind chat */}
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl scale-105" />

            <div className="relative glass-card rounded-3xl border border-primary/15 overflow-hidden shadow-2xl">
              {/* Window titlebar */}
              <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-gradient-to-r from-primary/8 to-secondary/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">NexMart AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="live-dot w-1.5 h-1.5" />
                    <span className="text-[11px] text-white/40">Online · Powered by Gemini</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3.5 min-h-[340px] max-h-[400px] overflow-hidden">
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
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1.5">
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
              <div className="p-4 border-t border-white/5">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-surface-2/50 rounded-full px-4 py-2.5 border border-white/8">
                    <input
                      type="text"
                      id="ai-chat-input"
                      placeholder="Ask AI to find products..."
                      className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <Mic className="w-4 h-4 text-white/30" />
                  </div>
                  <button className="w-10 h-10 rounded-full btn-primary flex items-center justify-center p-0">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -bottom-5 -right-5 glass border border-white/10 rounded-2xl p-3.5 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center">
                  <TrendingUp className="w-4.5 h-4.5 text-success" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40">AI Conversion Rate</p>
                  <p className="font-bold text-white text-sm">3.8× Higher</p>
                  <p className="text-[10px] text-success">vs. keyword search</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="section-label mb-5 inline-flex">
              <Sparkles className="w-3 h-3" />
              Powered by Gemini AI
            </span>

            <h2 className="heading-xl text-white mt-4 mb-6">
              Your Personal{" "}
              <span className="gradient-text-electric">AI Shopping</span>
              {" "}Assistant
            </h2>

            <p className="text-white/45 text-lg leading-relaxed mb-10 max-w-md">
              Simply describe what you need. Our AI understands context, budget, preferences,
              and use case to find exactly what you&apos;re looking for.
            </p>

            {/* Features */}
            <div className="space-y-3 mb-10">
              {aiFeatures.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-white/5 hover:border-primary/20 hover:bg-white/3 transition-all duration-200 group cursor-default"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm group-hover:text-primary transition-colors">{feature.title}</p>
                      <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link href="/ai-assistant" className="btn-primary inline-flex items-center gap-2.5 text-base px-8 py-4 glow-primary">
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
