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
    Filler,
    RadialLinearScale
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
    Filler,
    RadialLinearScale
);

const chartTypes = ["bar", "line", "doughnut", "pie", "radar", "polarArea", "bubble"] as const;

const getInitialChartType = (key: string, defaultType: typeof chartTypes[number]) => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(key);
        if (stored && chartTypes.includes(stored as any)) return stored as typeof chartTypes[number];
    }
    return defaultType;
};

export default function FinanceAnalyticsPage() {
    const t = useTranslations("AdminDashboard.dashboard.business.charts");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [cashFlowChartType, setCashFlowChartType] = useState<typeof chartTypes[number]>(() => getInitialChartType("cashFlowChartType", "bar"));
    const [netFlowChartType, setNetFlowChartType] = useState<typeof chartTypes[number]>(() => getInitialChartType("netFlowChartType", "bar"));
    const [accumulatedChartType, setAccumulatedChartType] = useState<typeof chartTypes[number]>(() => getInitialChartType("accumulatedChartType", "line"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/analytics/finance");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Error fetching finance data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Guardar cambios de tipo de gráfico en localStorage
    useEffect(() => { localStorage.setItem("cashFlowChartType", cashFlowChartType); }, [cashFlowChartType]);
    useEffect(() => { localStorage.setItem("netFlowChartType", netFlowChartType); }, [netFlowChartType]);
    useEffect(() => { localStorage.setItem("accumulatedChartType", accumulatedChartType); }, [accumulatedChartType]);

    if (loading) return <div className="p-8">{t("analysis")}</div>;
    if (!data) return <div className="p-8">No hay datos disponibles.</div>;

    const months = [...new Set(data.cashFlow.map((d: any) => d._id.month))];
    const incomeData = months.map(m => {
        const item = data.cashFlow.find((d: any) => d._id.month === m && d._id.type === "INGRESO");
        return item ? item.total : 0;
    });
    const expenseData = months.map(m => {
        const item = data.cashFlow.find((d: any) => d._id.month === m && d._id.type === "EGRESO");
        return item ? item.total : 0;
    });

    const cashFlowChartData = {
        labels: months,
        datasets: [
            { label: "Ingresos", data: incomeData, backgroundColor: "rgba(75, 192, 192, 0.6)" },
            { label: "Egresos", data: expenseData, backgroundColor: "rgba(255, 99, 132, 0.6)" },
        ],
    };

    const netFlowData = data.monthlyStats?.map((d: any) => d.netFlow) || [];
    const netFlowChartData = {
        labels: data.monthlyStats?.map((d: any) => d.month) || [],
        datasets: [
            {
                label: "Flujo Neto",
                data: netFlowData,
                backgroundColor: netFlowData.map((v: number) => v >= 0 ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)"),
            },
        ],
    };

    const accumulatedBalanceChartData = {
        labels: data.monthlyStats?.map((d: any) => d.month) || [],
        datasets: [
            {
                label: "Saldo Acumulado",
                data: data.monthlyStats?.map((d: any) => d.accumulatedBalance) || [],
                fill: true,
                backgroundColor: "rgba(53, 162, 235, 0.2)",
                borderColor: "rgb(53, 162, 235)",
                tension: 0.3,
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
            case "bubble": return <Bubble data={{
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
            className="mb-4 px-3 py-2 text-black border rounded"
        >
            {chartTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
            ))}
        </select>
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 {t("analysis")}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">{t("cashFlow")}</h3>
                    {renderChartSelector(cashFlowChartType, setCashFlowChartType)}
                    <div className="w-full max-w-md h-64 flex justify-center">
                        {renderChart(cashFlowChartType, cashFlowChartData)}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">{t("monthlyNetFlow")}</h3>
                    {renderChartSelector(netFlowChartType, setNetFlowChartType)}
                    <div className="w-full max-w-md h-64 flex justify-center">
                        {renderChart(netFlowChartType, netFlowChartData)}
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">{t("cashAcumulatedBalance")}</h3>
                    {renderChartSelector(accumulatedChartType, setAccumulatedChartType)}
                    <div className="w-full max-w-md h-64 flex justify-center">
                        {renderChart(accumulatedChartType, accumulatedBalanceChartData)}
                    </div>
                </div>
            </div>
        </div>
    );
}
