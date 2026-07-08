"use client";

import Link from "next/link";
import { Zap, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Products", href: "/products" },
    { label: "Flash Sales", href: "/flash-sales" },
    { label: "AI Assistant", href: "/ai-assistant" },
    { label: "Seller Hub", href: "/sellers" },
    { label: "Gift Cards", href: "/gift-cards" },
  ],
  "Customer Support": [
    { label: "Help Center", href: "/help" },
    { label: "Order Tracking", href: "/orders" },
    { label: "Returns & Refunds", href: "/returns" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Investor Relations", href: "/investors" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Seller Agreement", href: "/seller-agreement" },
  ],
};

const paymentMethods = ["Visa", "Mastercard", "UPI", "PayPal", "Paytm", "GPay"];

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-text-primary mb-2">
                Stay ahead of the deals 🔥
              </h3>
              <p className="text-text-muted">
                Get exclusive offers, flash sale alerts, and AI-powered recommendations in your inbox.
              </p>
            </div>
            <form className="flex gap-3 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="input rounded-full"
                  id="newsletter-email"
                />
              </div>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 whitespace-nowrap px-6"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-2xl gradient-text">NexMart</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              The next generation AI-powered smart commerce platform. Shop smarter with personalized 
              recommendations, dynamic pricing, and real-time insights.
            </p>
             <div className="flex items-center gap-3">
              {[
                {
                  label: "Twitter",
                  href: "#",
                  svg: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "#",
                  svg: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: "GitHub",
                  href: "#",
                  svg: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  svg: (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                },
              ].map(({ svg, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-surface-2 hover:bg-primary/20 hover:text-primary border border-border flex items-center justify-center text-text-muted transition-all duration-200 hover:border-primary/30"
                >
                  {svg}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@nexmart.ai" className="hover:text-primary transition-colors">support@nexmart.ai</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Phone className="w-4 h-4 text-primary" />
                <span>1800-NexMart (24/7)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-primary transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App Badges */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-muted">Download App:</span>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border hover:border-primary/30 transition-all text-sm font-medium text-text-secondary hover:text-primary"
                >
                  📱 App Store
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 border border-border hover:border-primary/30 transition-all text-sm font-medium text-text-secondary hover:text-primary"
                >
                  🤖 Google Play
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-muted">We accept:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="text-xs px-2 py-1 rounded-md bg-surface-2 border border-border text-text-muted font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} NexMart Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Built with ❤️ in India · Powered by{" "}
            <span className="gradient-text font-semibold">AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
