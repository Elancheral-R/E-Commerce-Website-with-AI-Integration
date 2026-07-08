import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NexMart — AI-Powered Smart Commerce",
    template: "%s | NexMart",
  },
  description:
    "NexMart is an AI-powered smart commerce platform offering personalized shopping, dynamic pricing, voice search, and intelligent recommendations — the future of online retail.",
  keywords: ["e-commerce", "AI shopping", "smart commerce", "online store", "NexMart"],
  authors: [{ name: "NexMart Team" }],
  creator: "NexMart",
  metadataBase: new URL("https://nexmart.ai"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://nexmart.ai",
    title: "NexMart — AI-Powered Smart Commerce",
    description: "Shop smarter with AI-powered recommendations, dynamic pricing, and voice search.",
    siteName: "NexMart",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexMart — AI-Powered Smart Commerce",
    description: "Shop smarter with AI-powered recommendations, dynamic pricing, and voice search.",
    creator: "@nexmart",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
