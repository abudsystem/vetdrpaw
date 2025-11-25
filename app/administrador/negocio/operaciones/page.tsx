"use client";

import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function OperationsAnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/analytics/operations");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                }
            } catch (error) {
                console.error("Error fetching operations data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8">Cargando datos operativos...</div>;
    if (!data) return <div className="p-8">No hay datos disponibles.</div>;

    const appointmentStatusData = {
        labels: data.appointmentStats.map((d: any) => d._id),
        datasets: [
            {
                data: data.appointmentStats.map((d: any) => d.count),
                backgroundColor: [
                    "#FFCE56", // Pendiente
                    "#4BC0C0", // Aceptada/Completada
                    "#FF6384"  // Cancelada
                ],
            },
        ],
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🏥 Análisis de Operaciones</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appointment Status */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Estado de Citas (Mes Actual)</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={appointmentStatusData} />
                    </div>
                </div>
            </div>
        </div>
    );
}
