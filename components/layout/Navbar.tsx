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
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/users/me");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch { }
        };

        fetchUser();
        window.addEventListener("userLoggedIn", fetchUser);
        return () => window.removeEventListener("userLoggedIn", fetchUser);
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 w-full overflow-x-hidden print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 shrink-0"
                    >
                        {/* Logo */}
                        <img
                            src="/icon.svg"
                            alt="DrPaw logo"
                            className="h-8 w-8 sm:h-9 sm:w-9 "
                        />

                        {/* Texto: solo en pantallas >= sm */}
                        <span className="hidden sm:block text-2xl font-bold text-teal-600">
                            Veterinaria DrPaw
                        </span>
                    </Link>


                    {/* Desktop menu */}
                    <div className="hidden min-[1000px]:flex space-x-8">
                        {[
                            ["Inicio", "/"],
                            ["Sobre Nosotros", "/sobre"],
                            ["Servicios", "/servicios"],
                            ["Cuidados", "/cuidado-mascota"],
                            ["Contacto", "/contacto"],
                        ].map(([label, href]) => (
                            <Link
                                key={href}
                                href={href}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-teal-500 transition-colors"
                            >
                                {label}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                href={`/${user.role}`}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-teal-500"
                            >
                                Perfil
                            </Link>
                        )}
                    </div>

                    {/* Desktop action */}
                    <div className="hidden min-[1000px]:flex">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm"
                            >
                                Agendar Cita
                            </Link>
                        )}
                    </div>

                    {/* Mobile button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="
    min-[1000px]:hidden
    p-3
    text-2xl
    rounded-md
    text-gray-600
    hover:bg-gray-100
  "
                    >
                        ☰
                    </button>

                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`${isOpen ? "block" : "hidden"
                    } min-[1000px]:hidden w-full max-w-full overflow-x-hidden`}
            >
                <div className="px-4 py-2 space-y-1">
                    {[
                        ["Inicio", "/"],
                        ["Sobre Nosotros", "/sobre"],
                        ["Servicios", "/servicios"],
                        ["Cuidados", "/cuidado-mascota"],
                        ["Contacto", "/contacto"],
                    ].map(([label, href]) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 break-words"
                        >
                            {label}
                        </Link>
                    ))}

                    {user && (
                        <Link
                            href={`/${user.role}`}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 break-words"
                        >
                            Perfil
                        </Link>
                    )}

                    <div className="pt-3 border-t">
                        {user ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left py-2 text-gray-700"
                            >
                                Cerrar Sesión
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-gray-700"
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
