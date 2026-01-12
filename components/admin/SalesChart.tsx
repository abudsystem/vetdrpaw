"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslations } from "next-intl";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface SalesChartProps {
    data: any[];
}

export default function SalesChart({ data }: SalesChartProps) {
    const t = useTranslations('AdminDashboard.dashboard.business.charts');
    const chartData = {
        labels: data.map((d: any) => d._id),
        datasets: [
            {
                label: t('salesTrend'),
                data: data.map((d: any) => d.total),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                tension: 0.3,
                fill: true,
            },
        ],
    };

    return (
        <div className="h-80">
            <Line options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
        </div>
    );
}
