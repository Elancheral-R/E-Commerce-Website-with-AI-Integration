import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // Use JWT strategy (no database session required)
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      // On first sign-in, enrich the token with Google profile data
      if (account && profile) {
        token.provider = account.provider;
        token.googleId = profile.sub;
        token.avatarUrl = (profile as { picture?: string }).picture;
        token.role = "customer"; // Default role for Google OAuth users
      }
      return token;
    },

    async session({ session, token }) {
      // Expose token fields to the client-side session object
      if (session.user) {
        if (session.user) {
  (session.user as any).id = token.sub ?? "";
  (session.user as any).role = token.role ?? "customer";
  (session.user as any).avatarUrl = token.avatarUrl;
}
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",       // Redirect to our custom login page
    error: "/auth/login",        // Show errors on login page
  },
});
