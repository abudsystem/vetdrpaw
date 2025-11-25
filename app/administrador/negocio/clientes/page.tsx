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

export default function ClientsAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/analytics/clients");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Error fetching client data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Cargando datos de clientes...</div>;
    if (!data) return <div className="p-8">No hay datos disponibles.</div>;

    const newClientsData = {
        labels: data.newClients.map((d: any) => d._id),
        datasets: [
            {
                label: "Nuevos Clientes",
                data: data.newClients.map((d: any) => d.count),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const petDemographicsData = {
        labels: data.petDemographics.map((d: any) => d._id),
        datasets: [
            {
                data: data.petDemographics.map((d: any) => d.count),
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF"
                ],
            },
        ],
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">👥 Análisis de Clientes</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* New Clients Chart */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Nuevos Clientes por Mes</h3>
                    <Bar data={newClientsData} options={{ responsive: true }} />
                </div>

                {/* Pet Demographics */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Demografía de Mascotas (Especie)</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={petDemographicsData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
