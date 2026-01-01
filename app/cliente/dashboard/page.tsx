"use client";

import { useState, useEffect } from "react";
import { ClientDashboardStats } from "@/types/dashboard";
import { Pet } from "@/types/pet";
import { Appointment } from "@/types/appointment";
import { StatsCards } from "@/components/cliente/dashboard/StatsCards";
import { QuickActions } from "@/components/cliente/dashboard/QuickActions";
import { UpcomingAppointments } from "@/components/cliente/dashboard/UpcomingAppointments";
import { PetsSummary } from "@/components/cliente/dashboard/PetsSummary";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function ClientDashboard() {
    const t = useTranslations('ClientPanel.dashboard');
    const [stats, setStats] = useState<ClientDashboardStats>({ totalPets: 0, upcomingAppointments: 0, pendingAppointments: 0 });
    const [pets, setPets] = useState<Pet[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [petsRes, appointmentsRes] = await Promise.all([
                fetch("/api/pets?my_pets=true"),
                fetch("/api/appointments?my_appointments=true"),
            ]);

            if (petsRes.ok) {
                const petsData = await petsRes.json();
                setPets(petsData.slice(0, 6)); // Show max 6 pets

                if (appointmentsRes.ok) {
                    const appointmentsData = await appointmentsRes.json();

                    // Filter upcoming appointments (future dates, not canceled)
                    const now = new Date();
                    const upcoming = appointmentsData.filter((apt: Appointment) =>
                        new Date(apt.date) > now && apt.status !== 'cancelada' && apt.status !== 'completada'
                    );

                    const pending = appointmentsData.filter((apt: Appointment) => apt.status === 'pendiente');

                    setAppointments(upcoming.slice(0, 3)); // Show next 3 appointments
                    setStats({
                        totalPets: petsData.length,
                        upcomingAppointments: upcoming.length,
                        pendingAppointments: pending.length,
                    });
                }
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

            {/* Statistics Cards */}
            <StatsCards stats={stats} loading={loading} />

            {/* Quick Actions */}
            <QuickActions />

            {/* Upcoming Appointments */}
            <UpcomingAppointments appointments={appointments} loading={loading} />

            {/* Pets Summary */}
            <PetsSummary pets={pets} loading={loading} />
        </motion.div>
    );
}
