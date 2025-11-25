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

export default function SalesAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                backgroundColor: "rgba(53, 162, 235, 0.6)",
            },
        ],
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🛍️ Análisis de Ventas</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Chart */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Ventas por Categoría</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={categoryData} />
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Top 5 Productos Más Vendidos</h3>
                    <Bar data={topProductsData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
}
