import { handlers } from "@/auth.config";

// NextAuth v5 App Router handler
// This creates GET and POST handlers at /api/auth/[...nextauth]
export const { GET, POST } = handlers;
