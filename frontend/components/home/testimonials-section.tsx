"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ananya Krishnan",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    rating: 5,
    text: "NexMart's AI assistant is absolutely mind-blowing. I described what I needed and it recommended the perfect products instantly. Saved me hours of research!",
    verified: true,
    purchase: "Home Office Bundle",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    rating: 5,
    text: "The dynamic pricing alerts are incredible. I got notified when my wishlist item dropped 30% and saved thousands. This platform is truly next-gen.",
    verified: true,
    purchase: "Gaming Laptop",
  },
  {
    name: "Priya Nair",
    role: "Startup Founder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
    text: "The order tracking is incredibly detailed. Customer support via the AI chatbot resolved my issue in 2 minutes. This is what the future of shopping looks like.",
    verified: true,
    purchase: "MacBook Pro",
  },
  {
    name: "Vijay Kumar",
    role: "Content Creator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay",
    rating: 5,
    text: "As a seller, the analytics dashboard is phenomenal. Real-time inventory management, AI pricing strategy suggestions — everything a modern seller needs.",
    verified: true,
    purchase: "Seller since 2023",
  },
  {
    name: "Sneha Gupta",
    role: "Fashion Blogger",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    rating: 5,
    text: "The style recommendations are so accurate it feels like having a personal shopper. Found pieces I never would have discovered on my own. Love it!",
    verified: true,
    purchase: "Fashion Bundle",
  },
  {
    name: "Arjun Sharma",
    role: "Photographer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    rating: 5,
    text: "Compared prices across 50+ sellers, found the best deal on my camera gear, and got it delivered the next day. NexMart is unbeatable on value.",
    verified: true,
    purchase: "Sony A7R IV",
  },
];

// Duplicate for seamless loop
const row1 = [...testimonials, ...testimonials];
const row2 = [...testimonials.slice(3), ...testimonials, ...testimonials.slice(0, 3)];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-80 mx-3">
      <div className="bg-surface border border-border rounded-2xl p-5 h-full hover:border-primary/20 hover:shadow-card-hover transition-all duration-300 group">
        {/* Quote + Stars */}
        <div className="flex items-start justify-between mb-4">
          <Quote className="w-7 h-7 text-primary/20" />
          <div className="flex gap-0.5">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
            ))}
          </div>
        </div>

        {/* Text */}
        <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-4 group-hover:text-text-primary transition-colors">
          &ldquo;{t.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-2 ring-2 ring-border flex-shrink-0">
            <img src={t.avatar} alt={t.name} className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-text-primary text-xs">{t.name}</p>
              {t.verified && (
                <span className="text-[9px] badge badge-success py-0 px-1.5">✓</span>
              )}
            </div>
            <p className="text-text-muted text-[10px]">{t.role}</p>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] text-primary font-semibold bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-full">
              {t.purchase}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { value: "4.9/5", label: "Average Rating", sub: "2.8M+ reviews" },
  { value: "98%", label: "Satisfaction Rate", sub: "Would recommend" },
  { value: "10M+", label: "Happy Shoppers", sub: "Across India" },
  { value: "3min", label: "Support Response", sub: "24/7 AI-powered" },
];

function AnimatedStat({ value, label, sub, delay }: { value: string; label: string; sub: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="text-center px-6"
    >
      <p className="font-display font-black text-4xl gradient-text">{value}</p>
      <p className="font-bold text-text-primary text-sm mt-2">{label}</p>
      <p className="text-text-muted text-xs mt-0.5">{sub}</p>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-2 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-label mb-5 inline-flex mx-auto">
            <Star className="w-3 h-3 fill-current" />
            Loved by Millions
          </span>
          <h2 className="heading-xl text-text-primary mt-4 mb-5">
            What Our Customers Say
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Join 10 million+ happy shoppers who trust NexMart for everyday needs
          </p>
        </motion.div>
      </div>

      {/* Marquee Row 1 — Left */}
      <div className="marquee-container mb-4">
        <div className="marquee-track animate-marquee">
          {row1.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 — Right */}
      <div className="marquee-container mb-14">
        <div className="marquee-track animate-marquee-reverse">
          {row2.map((t, i) => (
            <TestimonialCard key={`r2-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-0 divide-x divide-border">
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} {...stat} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
