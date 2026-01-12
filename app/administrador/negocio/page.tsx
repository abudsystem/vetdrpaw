"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { useTranslations } from "next-intl";

const SalesChart = dynamic(() => import("@/components/admin/SalesChart"), {
    loading: () => {
        const t = useTranslations('AdminDashboard.dashboard.stats');
        return <div className="h-80 bg-gray-100 rounded flex items-center justify-center">{t('totalsales')}</div>;
    },
    ssr: false
});

export default function BusinessDashboard() {
    const t = useTranslations('AdminDashboard.dashboard.business');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/analytics/dashboard");
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error(t('errorFeching'), error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">{t('loading')}</div>;
    if (!data) return <div className="p-8">{t('noAvailableData')}</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 {t("title")}</h1>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-700 text-sm font-medium">{t('stats.revenue')}</h3>
                    <p className="text-2xl font-bold text-gray-800">${data.metrics.totalRevenue.toFixed(2)}</p>
                    <p className={`text-xs mt-2 ${data.metrics.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.metrics.growth >= 0 ? '↑' : '↓'} {Math.abs(data.metrics.growth)}% {t('stats.growth')}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-700 text-sm font-medium">{t('stats.sales')}</h3>
                    <p className="text-2xl font-bold text-gray-800">{data.metrics.salesCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-700 text-sm font-medium">{t('stats.averageTicket')}</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        ${data.metrics.salesCount > 0 ? (data.metrics.totalRevenue / data.metrics.salesCount).toFixed(2) : "0.00"}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <h3 className="text-gray-700 text-sm font-medium">{t('stats.lastMonth')}</h3>
                    <p className="text-2xl font-bold text-gray-800">${data.metrics.lastMonthRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">{t('charts.salesTrend')}</h3>
                <SalesChart data={data.charts.salesOverTime} />
            </div>
        </div>
    );
}
