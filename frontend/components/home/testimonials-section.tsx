"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ananya Krishnan",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    rating: 5,
    text: "NexMart's AI assistant is absolutely mind-blowing. I described what I needed for my home office setup and it recommended the perfect combination of products within seconds. Saved me hours of research!",
    verified: true,
    purchase: "Home Office Bundle",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    rating: 5,
    text: "The dynamic pricing alerts are incredible. I got notified when my wishlist item dropped 30% just before the flash sale. I'm saving thousands every month because of this platform.",
    verified: true,
    purchase: "Gaming Laptop",
  },
  {
    name: "Priya Nair",
    role: "Startup Founder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
    text: "The order tracking is incredibly detailed. I could see exactly where my package was at every step. Customer support via the AI chatbot resolved my issue in 2 minutes. Truly next-gen!",
    verified: true,
    purchase: "MacBook Pro",
  },
  {
    name: "Vijay Kumar",
    role: "Content Creator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay",
    rating: 5,
    text: "As a seller on NexMart, the analytics dashboard is phenomenal. I can see exactly which products are trending, manage inventory in real-time, and the AI suggests the right pricing strategy.",
    verified: true,
    purchase: "Seller since 2023",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-surface-2 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-primary mb-4 inline-flex">
              ⭐ Loved by Millions
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Join 10 million+ happy shoppers who trust NexMart for their everyday needs
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/30 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-2">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text-primary text-sm">{testimonial.name}</p>
                    {testimonial.verified && (
                      <span className="text-[10px] badge badge-success py-0">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-text-muted text-xs">{testimonial.role}</p>
                  <p className="text-primary text-xs mt-0.5">{testimonial.purchase}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { value: "4.9/5", label: "Average Rating", sub: "Based on 2.8M reviews" },
            { value: "98%", label: "Customer Satisfaction", sub: "Would recommend to friends" },
            { value: "10M+", label: "Happy Shoppers", sub: "Across India" },
            { value: "3min", label: "Avg. Support Response", sub: "24/7 AI-powered help" },
          ].map((stat) => (
            <div key={stat.label} className="px-6">
              <p className="font-display font-bold text-3xl gradient-text">{stat.value}</p>
              <p className="font-semibold text-text-primary text-sm mt-1">{stat.label}</p>
              <p className="text-text-muted text-xs mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
