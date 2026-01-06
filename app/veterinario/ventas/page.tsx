"use client";

import { useState, useEffect } from "react";
import { ISale, SalesList } from "@/components/veterinario/ventas/SalesList";
import { SalesHeader } from "@/components/veterinario/ventas/SalesHeader";
import { Search } from "lucide-react";

export default function SalesPage() {
    const [sales, setSales] = useState<ISale[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await fetch("/api/sales");
            if (res.ok) {
                const data = await res.json();
                setSales(data);
            }
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSales = sales.filter(
        (sale) =>
            (sale.client?.name && sale.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (sale.paymentMethod && sale.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <SalesHeader />

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por cliente o método de pago..."
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {loading ? (
                <p>Cargando ventas...</p>
            ) : (
                <SalesList sales={filteredSales} />
            )}
        </div>
    );
}
