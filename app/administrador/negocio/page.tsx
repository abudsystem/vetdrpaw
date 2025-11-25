"use client";

import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function BusinessDashboard() {
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
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Cargando estadísticas...</div>;
    if (!data) return <div className="p-8">No hay datos disponibles.</div>;

    // Prepare Chart Data
    const salesOverTimeData = {
        labels: data.charts.salesOverTime.map((d: any) => d._id),
        datasets: [
            {
                label: "Ventas Mensuales ($)",
                data: data.charts.salesOverTime.map((d: any) => d.total),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Resumen Ejecutivo</h1>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Ingresos (Mes)</h3>
                    <p className="text-2xl font-bold text-gray-800">${data.metrics.totalRevenue.toFixed(2)}</p>
                    <p className={`text-xs mt-2 ${data.metrics.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.metrics.growth >= 0 ? '↑' : '↓'} {Math.abs(data.metrics.growth)}% vs mes anterior
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">Ventas Totales</h3>
                    <p className="text-2xl font-bold text-gray-800">{data.metrics.salesCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-medium">Ticket Promedio</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        ${data.metrics.salesCount > 0 ? (data.metrics.totalRevenue / data.metrics.salesCount).toFixed(2) : "0.00"}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                    <h3 className="text-gray-500 text-sm font-medium">Mes Anterior</h3>
                    <p className="text-2xl font-bold text-gray-800">${data.metrics.lastMonthRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Tendencia de Ventas (Últimos 6 Meses)</h3>
                <div className="h-80">
                    <Line options={{ responsive: true, maintainAspectRatio: false }} data={salesOverTimeData} />
                </div>
            </div>
        </div>
    );
}
