"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { AdminDashboardStats } from "@/types/dashboard";
import { DashboardStatsCards } from "@/components/administrador/dashboard/DashboardStatsCards";
import { RecentUsers } from "@/components/administrador/dashboard/RecentUsers";
import { useTranslations } from "next-intl";

export default function AdministradorDashboardPage() {
    const t = useTranslations("AdminDashboard");
    const [stats, setStats] = useState<AdminDashboardStats>({
        totalUsers: 0,
        vets: 0,
        clients: 0
    });
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const users: User[] = await res.json();

                // Calculate Stats
                const vets = users.filter(u => u.role === "veterinario").length;
                const clients = users.filter(u => u.role === "cliente").length;
                // const administradors = users.filter(u => u.role === "administrador").length; // Not used in stats currently

                setStats({
                    totalUsers: users.length,
                    vets,
                    clients
                });

                // Recent Registrations (Last 5)
                // Sort by createdAt desc if not already
                const sorted = [...users].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                setRecentUsers(sorted.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching administrador dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">{t("loading")}</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t("title")}</h1>
            <DashboardStatsCards stats={stats} />
            <RecentUsers users={recentUsers} />
        </div>
    );
}
