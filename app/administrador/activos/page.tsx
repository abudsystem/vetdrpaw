"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssetList } from "@/components/administrador/activos/AssetList";
import { Search } from "lucide-react";

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
    const [searchTerm, setSearchTerm] = useState("");
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

    const filteredAssets = assets.filter(
        (asset) =>
            asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <h3 className="text-gray-700 text-sm font-medium">Valor Total de Activos</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalValue.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-1">Valor actual en libros</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                        <h3 className="text-gray-700 text-sm font-medium">Depreciación Acumulada</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalDepreciation.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-gray-700 text-sm font-medium">Total de Items</h3>
                        <p className="text-2xl font-bold text-gray-800">{stats.count}</p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre o categoría..."
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Assets Table */}
            <AssetList assets={filteredAssets} onDelete={handleDelete} />
        </div>
    );
}
