"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Asset {
    _id: string;
    name: string;
    category: string;
    quantity: number;
    unitCost: number;
    totalValue: number;
    acquisitionDate: string;
    isDepreciable: boolean;
}

interface Stats {
    totalValue: number;
    totalDepreciation: number;
    count: number;
}

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assetsRes, statsRes] = await Promise.all([
                fetch("/api/assets"),
                fetch("/api/assets/stats")
            ]);

            if (assetsRes.ok) {
                const data = await assetsRes.json();
                setAssets(data);
            }
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este activo?")) return;

        try {
            const res = await fetch(`/api/assets/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("Error al eliminar el activo");
            }
        } catch (error) {
            console.error("Error deleting asset:", error);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Activos</h1>
                <Link
                    href="/administrador/activos/nuevo"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors w-full md:w-auto text-center"
                >
                    Nuevo Activo
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-sm font-medium">Valor Total de Activos</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Valor actual en libros</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                        <h3 className="text-gray-500 text-sm font-medium">Depreciación Acumulada</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalDepreciation.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-gray-500 text-sm font-medium">Total de Items</h3>
                        <p className="text-2xl font-bold text-gray-800">{stats.count}</p>
                    </div>
                </div>
            )}

            {/* Assets Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Unit.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adquisición</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {assets.map((asset) => (
                            <tr key={asset._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {asset.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {asset.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${asset.unitCost.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ${asset.totalValue.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(asset.acquisitionDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/administrador/activos/${asset._id}`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(asset._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {assets.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No hay activos registrados.
                    </div>
                )}
            </div>
        </div>
    );
}
