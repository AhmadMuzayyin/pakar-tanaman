import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prismaClient";

// Define the auth options separately for better type checking
export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Cari user berdasarkan email
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (!user) {
                        return null;
                    }

                    // Verifikasi password
                    const passwordValid = await compare(credentials.password, user.password);

                    if (!passwordValid) {
                        return null;
                    }

                    // Return user tanpa password
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        location: user.location
                    };
                } catch (error) {
                    console.error("NextAuth authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 hari
    },
    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: user.id,
                    name: user.name || '',
                    email: user.email || '',
                    location: user.location || undefined
                };
            }
            return token;
        },
        async session({ session, token }) {
            if (token.user && session.user) {
                session.user.id = token.user.id;
                session.user.name = token.user.name;
                session.user.email = token.user.email;
                session.user.location = token.user.location;
            }
            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);