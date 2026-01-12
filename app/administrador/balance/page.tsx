"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface AssetStats {
    totalValue: number;
    totalDepreciation: number;
    count: number;
}

interface LiabilityStats {
    totalDebt: number;
    totalPending: number;
    totalPaid: number;
    count: number;
}

export default function BalancePage() {
    const t = useTranslations("AdminDashboard.balance");
    const [assetsStats, setAssetsStats] = useState<AssetStats | null>(null);
    const [liabilitiesStats, setLiabilitiesStats] = useState<LiabilityStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds to catch updates
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [assetsRes, liabilitiesRes] = await Promise.all([
                fetch("/api/assets/stats"),
                fetch("/api/liabilities/stats")
            ]);

            if (assetsRes.ok) {
                const data = await assetsRes.json();
                setAssetsStats(data);
            }
            if (liabilitiesRes.ok) {
                const data = await liabilitiesRes.json();
                setLiabilitiesStats(data);
            }
        } catch (error) {
            console.error("Error fetching balance data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">{t('loading')}</div>;

    // Calculations
    const totalAssets = assetsStats?.totalValue || 0;
    const totalLiabilities = liabilitiesStats?.totalPending || 0;
    const equity = totalAssets - totalLiabilities;

    // Financial ratios
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const equityRatio = totalAssets > 0 ? (equity / totalAssets) * 100 : 0;

    // Health indicator
    let healthStatus: 'healthy' | 'moderate' | 'risk';
    let healthColor: string;
    let healthText: string;

    if (equityRatio >= 50) {
        healthStatus = 'healthy';
        healthColor = 'green';
        healthText = '🟢 ' + t('healthy');
    } else if (equityRatio >= 25) {
        healthStatus = 'moderate';
        healthColor = 'yellow';
        healthText = '🟡 ' + t('moderate');
    } else {
        healthStatus = 'risk';
        healthColor = 'red';
        healthText = '🔴 ' + t('risk');
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
                    <p className="text-gray-600 mt-1">{t('description')}</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link
                        href="/administrador/activos"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex-1 text-center"
                    >
                        {t('assets')}
                    </Link>
                    <Link
                        href="/administrador/pasivos"
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex-1 text-center"
                    >
                        {t('liabilities')}
                    </Link>
                </div>
            </div>

            {/* Main Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">{t('totalAssets')}</h3>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">${totalAssets.toLocaleString()}</p>
                    <p className="text-xs opacity-75">
                        {assetsStats?.count || 0} {t('registeredAssets')}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">{t('totalLiabilities')}</h3>
                        <span className="text-2xl">📉</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">${totalLiabilities.toLocaleString()}</p>
                    <p className="text-xs opacity-75">
                        {liabilitiesStats?.count || 0} {t('registeredLiabilities')}
                    </p>
                </div>

                <div className={`bg-gradient-to-br ${equity >= 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'
                    } text-white p-6 rounded-lg shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">{t('netWorth')}</h3>
                        <span className="text-2xl">💎</span>
                    </div>
                    <p className="text-3xl font-bold mb-1">${equity.toLocaleString()}</p>
                    <p className="text-xs opacity-75">
                        {equity >= 0 ? t('ownCapital') : t('equityDeficit')}
                    </p>
                </div>
            </div>

            {/* Accounting Equation */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                    📊 {t('accountingEquation')}
                </h2>
                <div className="flex items-center justify-center gap-4 flex-wrap text-center">
                    <div className="bg-white p-6 rounded-lg shadow min-w-[140px]">
                        <p className="text-sm text-gray-600 mb-1">{t('asset')}</p>
                        <p className="text-2xl font-bold text-blue-600">
                            ${totalAssets.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-3xl font-bold text-gray-600">=</div>
                    <div className="bg-white p-6 rounded-lg shadow min-w-[140px]">
                        <p className="text-sm text-gray-600 mb-1">{t('liability')}</p>
                        <p className="text-2xl font-bold text-red-600">
                            ${totalLiabilities.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-3xl font-bold text-gray-600">+</div>
                    <div className="bg-white p-6 rounded-lg shadow min-w-[140px]">
                        <p className="text-sm text-gray-600 mb-1">{t('equity')}</p>
                        <p className="text-2xl font-bold text-green-600">
                            ${equity.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Financial Health & Ratios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Indicator */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        🏥 {t('financialHealth.title')}
                    </h3>
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${healthStatus === 'healthy' ? 'bg-green-50 border-2 border-green-500' :
                            healthStatus === 'moderate' ? 'bg-yellow-50 border-2 border-yellow-500' :
                                'bg-red-50 border-2 border-red-500'
                            }`}>
                            <p className="text-2xl font-bold text-center mb-2">{healthText}</p>
                            <p className="text-sm text-gray-600 text-center">
                                {healthStatus === 'healthy' && t('financialHealth.healthy')}
                                {healthStatus === 'moderate' && t('financialHealth.moderate')}
                                {healthStatus === 'risk' && t('financialHealth.risk')}
                            </p>
                        </div>

                        {/* Visual bar */}
                        <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>{t('visualBar.title')}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden flex">
                                <div
                                    className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                                    style={{ width: `${equityRatio}%` }}
                                    title={`Patrimonio: ${equityRatio.toFixed(1)}%`}
                                >
                                    {equityRatio > 10 && `${equityRatio.toFixed(0)}%`}
                                </div>
                                <div
                                    className="bg-red-500 flex items-center justify-center text-xs text-white font-semibold"
                                    style={{ width: `${debtRatio}%` }}
                                    title={`${t('visualBar.debt')}: ${debtRatio.toFixed(1)}%`}
                                >
                                    {debtRatio > 10 && `${debtRatio.toFixed(0)}%`}
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-700 mt-1">
                                <span>💎 {t('visualBar.heritage')}</span>
                                <span>📉 {t('visualBar.debt')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Ratios */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        📈 {t('ratiosfinancial.title')}
                    </h3>
                    <div className="space-y-4">
                        <div className="border-l-4 border-green-500 pl-4">
                            <p className="text-sm text-gray-600">{t('ratiosfinancial.ratio')}</p>
                            <p className="text-2xl font-bold text-green-700">
                                {equityRatio.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-700 mt-1">
                                {t('ratiosfinancial.porcentage')}
                            </p>
                        </div>

                        <div className="border-l-4 border-red-500 pl-4">
                            <p className="text-sm text-gray-600">Razón de Endeudamiento</p>
                            <p className="text-2xl font-bold text-red-700">
                                {debtRatio.toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-700 mt-1">
                                {t('ratiosfinancial.percentageAssets')}
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm text-gray-600">{t('ratiosfinancial.depressedAcumulated')}</p>
                            <p className="text-2xl font-bold text-blue-700">
                                ${(assetsStats?.totalDepreciation || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-700 mt-1">
                                {t('ratiosfinancial.depressedAcumulatedDescription')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    ℹ️ {t('detail.detail')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700 mb-1">{t('detail.Totaldetail')}</p>
                        <p className="text-lg font-bold text-gray-800">
                            ${(liabilitiesStats?.totalDebt || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{t('detail.capitalInterest')}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700 mb-1">{t('detail.paidTotal')}</p>
                        <p className="text-lg font-bold text-green-600">
                            ${(liabilitiesStats?.totalPaid || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{t('detail.inliabilities')}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700 mb-1">{t('detail.initialValueAssets')}</p>
                        <p className="text-lg font-bold text-gray-800">
                            ${(totalAssets + (assetsStats?.totalDepreciation || 0)).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{t('detail.beforeDepreciation')}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-700 mb-1">{t('detail.presentValueAssets')}</p>
                        <p className="text-lg font-bold text-blue-600">
                            ${totalAssets.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{t('detail.afterDepreciation')}</p>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>{t('detail.autoUpdate')}</strong> {t('detail.autoUpdateDescription')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
