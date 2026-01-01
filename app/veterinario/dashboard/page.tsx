"use client";

import { Appointment } from "@/types/appointment";
import { VetDashboardStats } from "@/types/dashboard";
import { DashboardStats } from "@/components/veterinario/dashboard/DashboardStats";
import { QuickActions } from "@/components/veterinario/dashboard/QuickActions";
import { RecentActivity } from "@/components/veterinario/dashboard/RecentActivity";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface Pet {
    _id: string;
}

export default function VeterinarianDashboard() {
    const t = useTranslations('VetPanel.dashboard');

    // Queries
    const { data: appointments = [], isLoading: loadingAppts } = useQuery({
        queryKey: ['appointments', 'mine'],
        queryFn: () => apiClient<Appointment[]>('/api/appointments?my_appointments=true'),
    });

    const { data: pets = [], isLoading: loadingPets } = useQuery({
        queryKey: ['pets'],
        queryFn: () => apiClient<Pet[]>('/api/pets'),
    });

    const loading = loadingAppts || loadingPets;

    // Derived State
    const stats: VetDashboardStats = {
        appointmentsToday: appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length,
        activePatients: pets.length,
        pendingAppointments: appointments.filter(a => a.status === "pendiente").length
    };

    const recentActivity = appointments.slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-gray-500 font-medium mt-1">
                    {t('subtitle')}
                </p>
            </div>

            {/* Stats Cards */}
            <DashboardStats stats={stats} loading={loading} />

            {/* Quick Actions and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <QuickActions />
                <RecentActivity appointments={recentActivity} loading={loading} />
            </div>
        </motion.div>
    );
}
