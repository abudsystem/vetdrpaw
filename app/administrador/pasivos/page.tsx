"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
                        <h3 className="text-gray-500 text-sm font-medium">Deuda Total</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalDebt.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Capital + Intereses</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                        <h3 className="text-gray-500 text-sm font-medium">Monto Pendiente</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalPending.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Por pagar</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-gray-500 text-sm font-medium">Total Pagado</h3>
                        <p className="text-2xl font-bold text-gray-800">${stats.totalPaid.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Abonado hasta ahora</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-sm font-medium">Total de Pasivos</h3>
                        <p className="text-2xl font-bold text-gray-800">{stats.count}</p>
                    </div>
                </div>
            )}

            {/* Liabilities Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Original</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interés %</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plazo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Pendiente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago Mensual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {liabilities.map((liability) => (
                            <tr key={liability._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${liability.type === 'PRESTAMO'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {liability.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{liability.description}</div>
                                    <div className="text-xs text-gray-500">
                                        Inicio: {new Date(liability.startDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${liability.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {liability.interestRate}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {liability.termMonths} {liability.termMonths === 1 ? 'mes' : 'meses'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                    ${liability.pendingAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${liability.monthlyPayment.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${liability.status === 'ACTIVO'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                        {liability.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        href={`/administrador/pasivos/${liability._id}`}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(liability._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {liabilities.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No hay pasivos registrados.
                    </div>
                )}
            </div>
        </div>
    );
}
