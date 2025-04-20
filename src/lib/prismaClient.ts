import { PrismaClient } from "@prisma/client";

// Deklarasi global untuk PrismaClient
declare global {
    var prisma: PrismaClient | undefined;
}

// Membuat singleton instance dari PrismaClient
export const prisma = global.prisma || new PrismaClient();

// Hindari pembuatan koneksi berlebih selama hot reload di development
if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}