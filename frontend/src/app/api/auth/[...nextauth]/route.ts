/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/api/api";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { data } = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          if (data.token && data.user) {
            const nomeReal = data.user.firstName && data.user.lastName 
              ? `${data.user.firstName} ${data.user.lastName}`
              : data.user.nome || data.user.name || data.user.email.split('@')[0];

            return {
              id: data.user.id || data.user._id,
              email: data.user.email,
              name: nomeReal,
              nome: nomeReal,
              firstName: data.user.firstName || data.user.profile?.firstName || '',
              lastName: data.user.lastName || data.user.profile?.lastName || '',
              image: data.user.avatarUrl || data.user.profile?.avatarUrl || null,
              avatarUrl: data.user.avatarUrl || data.user.profile?.avatarUrl || null,
              coverUrl: data.user.coverUrl || data.user.profile?.coverUrl || null,
              accessToken: data.token,
            };
          }
          return null;
        } catch (error) {
          console.error('Erro no login:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.name = user.name;
        token.nome = user.nome;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
        token.avatarUrl = user.avatarUrl;
        token.coverUrl = user.coverUrl;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).name = token.name;
        (session.user as any).nome = token.nome;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        (session.user as any).image = token.image;
        (session.user as any).avatarUrl = token.avatarUrl;
        (session.user as any).coverUrl = token.coverUrl;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };