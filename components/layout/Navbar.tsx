"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

interface User {
    role: string;
    name: string;
}

export default function Navbar() {
    const t = useTranslations("Navbar");
    const locale = useLocale();
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

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

    const toggleLocale = () => {
        const nextLocale = locale === 'es' ? 'en' : 'es';
        // Set cookie manually
        document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
        router.refresh();
    };

    const navItems = [
        { label: t("home"), href: "/" },
        { label: t("about"), href: "/sobre" },
        { label: t("services"), href: "/servicios" },
        { label: t("care"), href: "/cuidado-mascota" },
        { label: t("contact"), href: "/contacto" },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 w-full overflow-x-hidden print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 shrink-0"
                    >
                        <img
                            src="/icon.svg"
                            alt="DrPaw logo"
                            className="h-8 w-8 sm:h-9 sm:w-9 "
                        />
                        <span className="hidden sm:block text-2xl font-bold text-teal-600">
                            Veterinaria DrPaw
                        </span>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden min-[1000px]:flex space-x-8 items-center">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-teal-500 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                href={`/${user.role}`}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 border-transparent hover:border-teal-500"
                            >
                                {t("profile")}
                            </Link>
                        )}

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLocale}
                            className="text-xs font-bold uppercase px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            {locale === 'es' ? 'EN' : 'ES'}
                        </button>
                    </div>

                    {/* Desktop action */}
                    <div className="hidden min-[1000px]:flex items-center gap-4">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
                            >
                                {t("logout")}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
                            >
                                {t("bookAppointment")}
                            </Link>
                        )}
                    </div>

                    {/* Mobile button */}
                    <div className="flex items-center gap-4 min-[1000px]:hidden">
                        <button
                            onClick={toggleLocale}
                            className="text-xs font-bold uppercase px-2 py-1 rounded bg-gray-100 text-gray-600"
                        >
                            {locale === 'es' ? 'EN' : 'ES'}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-center h-10 w-10 text-2xl rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            ☰
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`${isOpen ? "block" : "hidden"
                    } min-[1000px]:hidden w-full max-w-full overflow-x-hidden border-t border-gray-50`}
            >
                <div className="px-4 py-2 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 break-words"
                        >
                            {item.label}
                        </Link>
                    ))}

                    {user && (
                        <Link
                            href={`/${user.role}`}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-base font-medium text-gray-700 hover:bg-gray-100 break-words"
                        >
                            {t("profile")}
                        </Link>
                    )}

                    <div className="pt-3 border-t">
                        {user ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left py-2 text-gray-700 font-medium"
                            >
                                {t("logout")}
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-gray-700 font-medium"
                            >
                                {t("bookAppointment")}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
