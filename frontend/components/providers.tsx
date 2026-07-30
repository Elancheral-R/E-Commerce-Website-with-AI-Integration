"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

import { mockProducts } from "@/lib/mock-data";

if (typeof window !== "undefined") {
  // Clear any default mock products from localStorage
  const stored = localStorage.getItem("nexmart-products");
  if (stored) {
    const list: any[] = JSON.parse(stored);
    const cleaned = list.filter((p: any) => !["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].includes(p.id));
    localStorage.setItem("nexmart-products", JSON.stringify(cleaned));
  } else {
    localStorage.setItem("nexmart-products", JSON.stringify([]));
  }

  if (process.env.NODE_ENV === "development") {
    const orig = console.error;
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
        return;
      }
      orig.apply(console, args);
    };
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 2,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
