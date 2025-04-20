"use client";

import { SessionProvider } from "next-auth/react";
import NavigationBar from "@/components/NavigationBar";

interface ClientProvidersProps {
    children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <SessionProvider>
            <NavigationBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </SessionProvider>
    );
}