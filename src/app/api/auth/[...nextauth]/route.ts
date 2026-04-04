import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const users = [
          { id: "1", email: "admin@edumanage.com", password: "admin123", name: "????? ??????", role: "admin" },
          { id: "2", email: "teacher@edumanage.com", password: "teacher123", name: "??????", role: "teacher" },
          { id: "3", email: "parent@edumanage.com", password: "parent123", name: "??? ?????", role: "parent" },
        ];
        const user = users.find(u => u.email === credentials?.email && u.password === credentials?.password);
        return user ?? null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "placeholder_secret_123",
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };
