import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email dan password diperlukan");
                }

                // Cari user berdasarkan email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    throw new Error("Akun tidak ditemukan");
                }

                // Verifikasi password
                const passwordValid = await compare(credentials.password, user.password);

                if (!passwordValid) {
                    throw new Error("Password tidak valid");
                }

                // Return user tanpa password
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    location: user.location
                };
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
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as {
                id: string;
                name?: string;
                email?: string;
                location?: string;
            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});