import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, password, location } = req.body;

    // Validasi
    if (!name || !email || !password || !location) {
        return res.status(400).json({ message: "Semua field harus diisi" });
    }

    try {
        // Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds);

        // Buat user baru
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                location,
            },
        });

        // Return user tanpa password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json({
            message: "Registrasi berhasil",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Error saat registrasi:", error);
        return res.status(500).json({ message: "Terjadi kesalahan di server" });
    }
}