"use client";

import { useState, useEffect } from "react";
import { Bar, Doughnut, Line, Pie, Radar, PolarArea, Bubble } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    Filler
} from "chart.js";
import { useTranslations } from "next-intl";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    Filler
);

const chartTypes = ["bar", "line", "doughnut", "pie", "radar", "polarArea", "bubble"] as const;

const getInitialChartType = (key: string, defaultType: typeof chartTypes[number]) => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(key);
        if (stored && chartTypes.includes(stored as any)) return stored as typeof chartTypes[number];
    }
    return defaultType;
};

export default function SalesAnalyticsPage() {
    const t = useTranslations("AdminDashboard.dashboard.business.charts");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [categoryChartType, setCategoryChartType] = useState<typeof chartTypes[number]>(() =>
        getInitialChartType("categoryChartType", "doughnut")
    );
    const [topProductsChartType, setTopProductsChartType] = useState<typeof chartTypes[number]>(() =>
        getInitialChartType("topProductsChartType", "bar")
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/analytics/sales");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Error fetching sales data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => { localStorage.setItem("categoryChartType", categoryChartType); }, [categoryChartType]);
    useEffect(() => { localStorage.setItem("topProductsChartType", topProductsChartType); }, [topProductsChartType]);

    if (loading) return <div className="p-8">Cargando datos de ventas...</div>;
    if (!data) return <div className="p-8">No hay datos disponibles.</div>;

    const categoryData = {
        labels: data.salesByCategory.map((d: any) => d._id),
        datasets: [
            {
                data: data.salesByCategory.map((d: any) => d.total),
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    const topProductsData = {
        labels: data.topProducts.map((d: any) => d._id),
        datasets: [
            {
                label: "Unidades Vendidas",
                data: data.topProducts.map((d: any) => d.quantity),
                backgroundColor: [
                    "#36A2EB",
                    "#FF6384",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF"],
            },
        ],
    };

    const chartOptions = { responsive: true, maintainAspectRatio: false };

    const renderChart = (type: typeof chartTypes[number], chartData: any) => {
        switch (type) {
            case "bar": return <Bar data={chartData} options={chartOptions} />;
            case "line": return <Line data={chartData} options={chartOptions} />;
            case "doughnut": return <Doughnut data={chartData} options={chartOptions} />;
            case "pie": return <Pie data={chartData} options={chartOptions} />;
            case "radar": return <Radar data={chartData} options={chartOptions} />;
            case "polarArea": return <PolarArea data={chartData} options={chartOptions} />;
            case "bubble":
                return <Bubble data={{
                    datasets: chartData.labels.map((label: string, i: number) => ({
                        label,
                        data: [{ x: i + 1, y: chartData.datasets[0].data[i], r: 5 }],
                        backgroundColor: chartData.datasets[0].backgroundColor[i % chartData.datasets[0].backgroundColor.length]
                    }))
                }} options={chartOptions} />;
            default: return null;
        }
    };

    const renderChartSelector = (currentType: typeof chartTypes[number], setType: any) => (
        <select
            value={currentType}
            onChange={(e) => setType(e.target.value)}
            className="mb-4 px-3 py-2 border text-black rounded"
        >
            {chartTypes.map((type) => (
                <option key={type} value={type}>
                    {type}
                </option>
            ))}
        </select>
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🛍️ {t("titleSales")}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Chart */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">{t("salesByCategory")}</h3>
                    {renderChartSelector(categoryChartType, setCategoryChartType)}
                    <div className="w-full max-w-md h-64 flex justify-center">
                        {renderChart(categoryChartType, categoryData)}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-black font-semibold mb-2 text-gray-700">{t("top5Products")}</h3>
                    {renderChartSelector(topProductsChartType, setTopProductsChartType)}
                    <div className="w-full max-w-md h-64 flex justify-center">
                        {renderChart(topProductsChartType, topProductsData)}
                    </div>
                </div>
            </div>
        </div>
    );
}
