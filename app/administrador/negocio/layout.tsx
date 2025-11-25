"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AnalyticsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        { name: "🏠 Resumen", href: "/administrador/negocio" },
        { name: "💰 Finanzas", href: "/administrador/negocio/finanzas" },
        { name: "👥 Clientes", href: "/administrador/negocio/clientes" },
        { name: "🛍️ Ventas", href: "/administrador/negocio/ventas" },
        { name: "🏥 Operaciones", href: "/administrador/negocio/operaciones" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-2">
                <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`
                                    px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                                    ${isActive
                                        ? "bg-teal-100 text-teal-700"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            {children}
        </div>
    );
}
