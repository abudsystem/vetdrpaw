"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

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
    const t = useTranslations('AdminDashboard.cashFlow');
    const [transactions, setTransactions] = useState<CashFlowTransaction[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
            console.error(t("errorFetchingCashFlowData"), error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t("confirmDelete"))) return;

        try {
            const res = await fetch(`/api/cashflow/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchData();
            } else {
                alert(t("errorDeleteTransaction"));
            }
        } catch (error) {
            console.error(t("catchErrorTransaction"), error);
        }
    };

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">{t("loading")}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
                    <p className="text-gray-600 mt-1">{t("description")}</p>
                </div>
                <Link
                    href="/administrador/flujodecaja/nuevo"
                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <span className="text-xl">💵</span>
                    {t("registerTransaction")}
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className={`p-6 rounded-lg shadow-md border-l-4 ${stats.currentCash >= 0
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-700'
                        : 'bg-gradient-to-br from-red-500 to-red-600 border-red-700'
                        } text-white`}>
                        <h3 className="text-sm font-medium opacity-90">💰 {t("currentBox")}</h3>
                        <p className="text-3xl font-bold mt-2">
                            ${stats.currentCash.toLocaleString()}
                        </p>
                        <p className="text-xs opacity-75 mt-1">{t("cashAvalible")}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-gray-700 text-sm font-medium">📅 {t("dailyBalance")}</h3>
                        <p className={`text-2xl font-bold ${stats.daily.balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            ${stats.daily.balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            ↑ ${stats.daily.ingresos.toLocaleString()} /
                            ↓ ${stats.daily.egresos.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                        <h3 className="text-gray-700 text-sm font-medium">📊 {t("monthBalance")}</h3>
                        <p className={`text-2xl font-bold ${stats.monthly.balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            ${stats.monthly.balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            ↑ ${stats.monthly.ingresos.toLocaleString()} /
                            ↓ ${stats.monthly.egresos.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500">
                        <h3 className="text-gray-700 text-sm font-medium">📝 {t("transactions")}</h3>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalTransactions}</p>
                        <p className="text-xs text-gray-600 mt-1">{t("totalRegister")}</p>
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
                            <strong>💡 {t('automaticIntegration.title')}</strong>{" "}
                            {t('automaticIntegration.description')}
                        </p>

                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("placeholder")}
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t("form.date")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t("form.type")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t("form.category")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t("form.description")}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">{t("form.amount")}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">{t("form.actions")}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'INGRESO'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {transaction.type === 'INGRESO' ? t('span.income') : t('span.expense')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {transaction.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{transaction.description}</div>
                                    <div className="text-xs text-gray-700">
                                        Por: {transaction.createdBy}
                                        {transaction.relatedDocument && (
                                            <span className="ml-2 text-blue-600">🤖 {t('span.auto')}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-lg font-bold ${transaction.type === 'INGRESO' ? t('span.income') : t('span.expense')
                                        }`}>
                                        {transaction.type === 'INGRESO' ? t('span.plus') : t('span.minus')}
                                        ${transaction.amount.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {transaction.relatedDocument ? (
                                        <span className="text-gray-600 cursor-not-allowed" title="Entrada automática - no se puede eliminar">
                                            🔒 {t('span.auto')}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(transaction._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            {t('button.Delete')}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                    <div className="p-6 text-center text-gray-700">
                        {searchTerm ? t('filtered.noData') : t('filtered.noDataTransactions')}
                    </div>
                )}
            </div>
        </div>
    );
}
