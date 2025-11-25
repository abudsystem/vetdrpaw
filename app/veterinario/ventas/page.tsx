"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ISale {
    _id: string;
    total: number;
    paymentMethod: string;
    date: string;
    client?: { name: string };
    user: { name: string };
    products: any[];
}

export default function SalesPage() {
    const [sales, setSales] = useState<ISale[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Historial de Ventas</h1>
                <Link
                    href="/veterinario/ventas/nueva"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                    + Nueva Venta
                </Link>
            </div>

            {loading ? (
                <p>Cargando ventas...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Fecha</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Cliente</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Total</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Método Pago</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Registrado Por</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                                        No hay ventas registradas.
                                    </td>
                                </tr>
                            ) : (
                                sales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            {new Date(sale.date).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            {sale.client?.name || "Cliente General"}
                                        </td>
                                        <td className="py-3 px-4 border-b text-gray-800 font-bold">
                                            ${sale.total.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            {sale.paymentMethod}
                                        </td>
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            {sale.user?.name || "N/A"}
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <Link
                                                href={`/veterinario/ventas/detalle/${sale._id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Ver Factura
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
