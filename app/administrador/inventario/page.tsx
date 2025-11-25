"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    name: string;
    category: string;
    quantity: number;
    unitCost: number;
    salePrice: number;
    minStock: number;
    expiryDate?: string;
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all, lowStock, expiring

    useEffect(() => {
        fetchProducts();
    }, [filter, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let url = `/api/inventory?search=${search}`;
            if (filter === "lowStock") url += "&lowStock=true";
            if (filter === "expiring") url += "&expiring=true";

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Inventario General</h1>
                <Link
                    href="/administrador/inventario/nuevo"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    + Nuevo Producto
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${filter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter("lowStock")}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${filter === "lowStock" ? "bg-red-100 text-red-700 ring-1 ring-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        Stock Bajo
                    </button>
                    <button
                        onClick={() => setFilter("expiring")}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${filter === "expiring" ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        Por Caducar
                    </button>
                </div>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full text-black pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio Venta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    Cargando inventario...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No se encontraron productos.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const isLowStock = product.quantity <= product.minStock;
                                const isExpiring = product.expiryDate && new Date(product.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                                return (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            {product.expiryDate && (
                                                <div className="text-xs text-gray-500">
                                                    Vence: {new Date(product.expiryDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-bold ${isLowStock ? "text-red-600" : "text-gray-900"}`}>
                                                {product.quantity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${product.salePrice.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                {isLowStock && (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        Stock Bajo
                                                    </span>
                                                )}
                                                {isExpiring && (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                        Por Caducar
                                                    </span>
                                                )}
                                                {!isLowStock && !isExpiring && (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        OK
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/administrador/inventario/${product._id}`}
                                                className="text-teal-600 hover:text-teal-900"
                                            >
                                                Gestionar
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
