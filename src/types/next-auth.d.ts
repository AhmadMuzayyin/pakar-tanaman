import "next-auth";

// Extend the built-in types for NextAuth
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            location?: string | null;
        }
    }

    // Extend the built-in User interface
    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        location?: string | null;
    }
}

// Also extend the JWT payload
declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            id: string;
            name: string;
            email: string;
            location?: string;
        }
    }
}