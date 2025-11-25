"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CashFlowTransaction {
    _id: string;
    date: string;
    type: 'INGRESO' | 'EGRESO';
    category: string;
    description: string;
    amount: number;
    createdBy: string;
    relatedDocument?: string; // Added for automatic entries
}

interface Stats {
    daily: {
        ingresos: number;
        egresos: number;
        balance: number;
    };
    monthly: {
        ingresos: number;
        egresos: number;
        balance: number;
    };
    currentCash: number;
    totalTransactions: number;
}

export default function CashFlowPage() {
    const [transactions, setTransactions] = useState<CashFlowTransaction[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transactionsRes, statsRes] = await Promise.all([
                fetch("/api/cashflow"),
                fetch("/api/cashflow/stats")
            ]);

            if (transactionsRes.ok) {
                const data = await transactionsRes.json();
                setTransactions(data);
            }
            if (statsRes.ok) {
                const data = await statsRes.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching cash flow data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta transacción?")) return;

        try {
            const res = await fetch(`/api/cashflow/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchData();
            } else {
                alert("Error al eliminar la transacción");
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Flujo de Caja</h1>
                    <p className="text-gray-600 mt-1">Control de entradas y salidas de dinero</p>
                </div>
                <Link
                    href="/administrador/flujodecaja/nuevo"
                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <span className="text-xl">💵</span>
                    Registrar Transacción
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className={`p-6 rounded-lg shadow-md border-l-4 ${stats.currentCash >= 0
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-700'
                        : 'bg-gradient-to-br from-red-500 to-red-600 border-red-700'
                        } text-white`}>
                        <h3 className="text-sm font-medium opacity-90">💰 Caja Actual</h3>
                        <p className="text-3xl font-bold mt-2">
                            ${stats.currentCash.toLocaleString()}
                        </p>
                        <p className="text-xs opacity-75 mt-1">Efectivo disponible</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-sm font-medium">📅 Balance Diario</h3>
                        <p className={`text-2xl font-bold ${stats.daily.balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            ${stats.daily.balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            ↑ ${stats.daily.ingresos.toLocaleString()} /
                            ↓ ${stats.daily.egresos.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                        <h3 className="text-gray-500 text-sm font-medium">📊 Balance Mensual</h3>
                        <p className={`text-2xl font-bold ${stats.monthly.balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            ${stats.monthly.balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            ↑ ${stats.monthly.ingresos.toLocaleString()} /
                            ↓ ${stats.monthly.egresos.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500">
                        <h3 className="text-gray-500 text-sm font-medium">📝 Transacciones</h3>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalTransactions}</p>
                        <p className="text-xs text-gray-400 mt-1">Total registrado</p>
                    </div>
                </div>
            )}

            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        📌
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>💡 Integración Automática:</strong> Las <strong>ventas</strong> se registran automáticamente aquí cuando se completan.
                            Los pagos de <strong>pasivos</strong> y compras de <strong>inventario</strong> también se reflejarán automáticamente.
                            Solo necesitas registrar manualmente gastos generales y otros ingresos misceláneos.
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'INGRESO'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {transaction.type === 'INGRESO' ? '↑ INGRESO' : '↓ EGRESO'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {transaction.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{transaction.description}</div>
                                    <div className="text-xs text-gray-500">
                                        Por: {transaction.createdBy}
                                        {transaction.relatedDocument && (
                                            <span className="ml-2 text-blue-600">🤖 Auto</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-lg font-bold ${transaction.type === 'INGRESO' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'INGRESO' ? '+' : '-'}
                                        ${transaction.amount.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {transaction.relatedDocument ? (
                                        <span className="text-gray-400 cursor-not-allowed" title="Entrada automática - no se puede eliminar">
                                            🔒 Automático
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(transaction._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No hay transacciones registradas. Registra tu primera transacción usando el botón superior.
                    </div>
                )}
            </div>
        </div>
    );
}
