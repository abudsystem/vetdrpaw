"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    role: string;
    name: string;
}

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/users/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-teal-600">
                            VetDrPaw
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <Link
                            href="/"
                            className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/sobre"
                            className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                        >
                            Sobre Nosotros
                        </Link>
                        <Link
                            href="/servicios"
                            className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                        >
                            Servicios
                        </Link>
                        <Link
                            href="/cuidado-mascota"
                            className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                        >
                            Cuidados
                        </Link>
                        <Link
                            href="/contacto"
                            className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                        >
                            Contacto
                        </Link>
                        {user && (
                            <Link
                                href={`/${user.role}`}
                                className="border-transparent text-gray-500 hover:border-teal-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                            >
                                Perfil
                            </Link>
                        )}
                    </div>
                    <div className="hidden sm:flex items-center space-x-4">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                            >
                                Agendar Cita
                            </Link>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            <div className={`${isOpen ? "block" : "hidden"} sm:hidden`} id="mobile-menu">
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        href="/"
                        className="bg-teal-50 border-teal-500 text-teal-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/sobre"
                        className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Sobre Nosotros
                    </Link>
                    <Link
                        href="/servicios"
                        className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Servicios
                    </Link>
                    <Link
                        href="/cuidado-mascota"
                        className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Cuidados
                    </Link>
                    <Link
                        href="/contacto"
                        className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Contacto
                    </Link>
                    {user && (
                        <Link
                            href={`/${user.role}`}
                            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            Perfil
                        </Link>
                    )}
                </div>
                <div className="pt-4 pb-4 border-t border-gray-200">
                    <div className="flex items-center px-4">
                        {user ? (
                            <div className="flex-shrink-0">
                                <div className="text-base font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm font-medium text-gray-500 capitalize">{user.role}</div>
                            </div>
                        ) : (
                            <div className="text-base font-medium text-gray-800">Invitado</div>
                        )}
                    </div>
                    <div className="mt-3 space-y-1">
                        {user ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                onClick={() => setIsOpen(false)}
                            >
                                Agendar Cita
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
