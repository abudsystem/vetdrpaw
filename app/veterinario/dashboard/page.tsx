"use client";

import { useEffect, useState } from "react";
import { Appointment } from "@/types/appointment";
import { VetDashboardStats } from "@/types/dashboard";
import { DashboardStats } from "@/components/veterinario/dashboard/DashboardStats";
import { QuickActions } from "@/components/veterinario/dashboard/QuickActions";
import { RecentActivity } from "@/components/veterinario/dashboard/RecentActivity";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface Pet {
    _id: string;
}

export default function VeterinarianDashboard() {
    const t = useTranslations('VetPanel.dashboard');
    const [stats, setStats] = useState<VetDashboardStats>({
        appointmentsToday: 0,
        activePatients: 0,
        pendingAppointments: 0
    });
    const [recentActivity, setRecentActivity] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [apptRes, petsRes] = await Promise.all([
                fetch("/api/appointments?my_appointments=true"),
                fetch("/api/pets")
            ]);

            if (apptRes.ok && petsRes.ok) {
                const appointments: Appointment[] = await apptRes.json();
                const pets: Pet[] = await petsRes.json();

                // Calculate Stats
                const today = new Date().toDateString();
                const todayAppts = appointments.filter(a => new Date(a.date).toDateString() === today);
                const pendingAppts = appointments.filter(a => a.status === "pendiente");

                setStats({
                    appointmentsToday: todayAppts.length,
                    activePatients: pets.length,
                    pendingAppointments: pendingAppts.length
                });

                // Recent Activity (Last 5 appointments)
                setRecentActivity(appointments.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

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
