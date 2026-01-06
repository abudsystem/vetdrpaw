"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiabilityList } from "@/components/administrador/pasivos/LiabilityList";
import { Search } from "lucide-react";

interface Liability {
    _id: string;
    type: 'PRESTAMO' | 'OBLIGACION';
    description: string;
    amount: number;
    startDate: string;
    interestRate: number;
    termMonths: number;
    amountPaid: number;
    status: 'ACTIVO' | 'PAGADO';
    // Calculated fields from backend
    totalInterest: number;
    totalDebt: number;
    pendingAmount: number;
    monthlyPayment: number;
}

interface Stats {
    totalDebt: number;
    totalPending: number;
    totalPaid: number;
    count: number;
}

export default function LiabilitiesPage() {
    const [liabilities, setLiabilities] = useState<Liability[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [liabilitiesRes, statsRes] = await Promise.all([
                fetch("/api/liabilities"),
                fetch("/api/liabilities/stats")
            ]);

            if (liabilitiesRes.ok) {
                const data = await liabilitiesRes.json();
                setLiabilities(data);
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
        if (!confirm("¿Estás seguro de eliminar este pasivo?")) return;

        try {
            const res = await fetch(`/api/liabilities/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("Error al eliminar el pasivo");
            }
        } catch (error) {
            console.error("Error deleting liability:", error);
        }
    };

    const filteredLiabilities = liabilities.filter(
        (liability) =>
            liability.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            liability.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Pasivos</h1>
                <Link
                    href="/administrador/pasivos/nuevo"
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Nuevo Pasivo
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                        <h3 className="text-gray-700 text-sm font-medium">Deuda Total</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalDebt.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-1">Capital + Intereses</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                        <h3 className="text-gray-700 text-sm font-medium">Monto Pendiente</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalPending.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-1">Por pagar</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-gray-700 text-sm font-medium">Total Pagado</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalPaid.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-1">Abonado hasta ahora</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-gray-700 text-sm font-medium">Total de Pasivos</h3>
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
                        placeholder="Buscar por descripción o tipo..."
                        className=" text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Liabilities Table */}
            <LiabilityList liabilities={filteredLiabilities} onDelete={handleDelete} />
        </div>
    );
}
