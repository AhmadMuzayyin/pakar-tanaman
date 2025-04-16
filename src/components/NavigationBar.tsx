"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function NavigationBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'border-b-2 border-green-600 text-green-700' : 'border-transparent text-gray-600 hover:text-green-700';
    };

    const handleSignOut = async () => {
        await signOut({ redirect: true, callbackUrl: '/' });
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <div className="h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                            </div>
                            <span className="ml-2 text-xl font-bold text-green-800">Pakar Tanaman</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}>
                                Beranda
                            </Link>
                            <Link href="/plants" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/plants')}`}>
                                Tanaman
                            </Link>
                            <Link href="/recommendations" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/recommendations')}`}>
                                Rekomendasi
                            </Link>
                            <Link href="/weather" className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/weather')}`}>
                                Cuaca
                            </Link>
                        </div>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {status === 'authenticated' ? (
                            <div className="flex items-center">
                                <span className="text-sm text-gray-700 mr-4">
                                    Halo, {session.user?.name}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors"
                                >
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-600 hover:text-green-700 px-3 py-1.5 rounded-md text-sm font-medium"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`} id="mobile-menu">
                <div className="pt-2 pb-3 space-y-1">
                    <Link href="/" className={`block pl-3 pr-4 py-2 text-base font-medium ${pathname === '/' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'}`}>
                        Beranda
                    </Link>
                    <Link href="/plants" className={`block pl-3 pr-4 py-2 text-base font-medium ${pathname === '/plants' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'}`}>
                        Tanaman
                    </Link>
                    <Link href="/recommendations" className={`block pl-3 pr-4 py-2 text-base font-medium ${pathname === '/recommendations' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'}`}>
                        Rekomendasi
                    </Link>
                    <Link href="/weather" className={`block pl-3 pr-4 py-2 text-base font-medium ${pathname === '/weather' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'}`}>
                        Cuaca
                    </Link>
                </div>
                {status === 'authenticated' ? (
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">
                                        {session.user?.name?.charAt(0)}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800">{session.user?.name}</div>
                                <div className="text-sm font-medium text-gray-500">{session.user?.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="space-y-1 px-4">
                            <Link href="/login" className="block text-base font-medium text-gray-600 hover:bg-gray-100 py-2">
                                Masuk
                            </Link>
                            <Link href="/register" className="block text-base font-medium text-green-700 hover:bg-gray-100 py-2">
                                Daftar
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}