"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarLink {
    href: string;
    label: string;
}

interface SidebarProps {
    title: string;
    links: SidebarLink[];
    bgColor?: string; // Tailwind class for background color, e.g., "bg-gray-900"
    hoverColor?: string; // Tailwind class for hover color, e.g., "hover:bg-gray-800"
    borderColor?: string; // Tailwind class for border color, e.g., "border-gray-800"
}

export default function Sidebar({
    title,
    links,
    bgColor = "bg-gray-900",
    hoverColor = "hover:bg-gray-800",
    borderColor = "border-gray-800",
}: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Mobile Header */}
            <div className={`md:hidden flex items-center justify-between p-4 ${bgColor} text-white`}>
                <h2 className="text-xl font-bold">{title}</h2>
                <button onClick={toggleSidebar} className="p-2 focus:outline-none">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 ${bgColor} text-white transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:relative md:translate-x-0 md:block
                `}
            >
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={toggleSidebar} className="md:hidden p-2 focus:outline-none">
                        <X size={24} />
                    </button>
                </div>
                <nav className="mt-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block py-3 px-6 ${hoverColor} transition-colors ${pathname === link.href ? "bg-opacity-50 bg-white/10" : ""
                                }`}
                            onClick={() => setIsOpen(false)} // Close on click for mobile
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/"
                        className={`block py-3 px-6 ${hoverColor} transition-colors mt-10 border-t ${borderColor}`}
                    >
                        Volver al Inicio
                    </Link>
                </nav>
            </aside>
        </>
    );
}
