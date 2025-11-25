"use client";

import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function FinanceAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-8">Cargando datos financieros...</div>;
    if (!data) return <div className="p-8">No hay datos disponibles.</div>;

    // Process Cash Flow Data
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
            {
                label: "Ingresos",
                data: incomeData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Egresos",
                data: expenseData,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
        ],
    };

    const expensesChartData = {
        labels: data.expensesBreakdown.map((d: any) => d._id),
        datasets: [
            {
                data: data.expensesBreakdown.map((d: any) => d.total),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40"
                ],
            },
        ],
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Análisis Financiero</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cash Flow Chart */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Flujo de Caja (Ingresos vs Egresos)</h3>
                    <Bar data={cashFlowChartData} options={{ responsive: true }} />
                </div>

                {/* Expenses Breakdown */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Desglose de Gastos</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={expensesChartData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
