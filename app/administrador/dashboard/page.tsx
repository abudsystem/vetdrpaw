"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { AdminDashboardStats } from "@/types/dashboard";
import { DashboardStatsCards } from "@/components/administrador/dashboard/DashboardStatsCards";
import { RecentUsers } from "@/components/administrador/dashboard/RecentUsers";

export default function AdministradorDashboardPage() {
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
        setLoading(true);
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const users: User[] = await res.json();

                // Calculate Stats
                const vets = users.filter(u => u.role === "veterinario").length;
                const clients = users.filter(u => u.role === "cliente").length;

                setStats({
                    totalUsers: users.length,
                    vets,
                    clients
                });

                // Recent Registrations (Last 5)
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

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Panel de Administración
            </h1>
            <DashboardStatsCards stats={stats} loading={loading} />
            <RecentUsers users={recentUsers} loading={loading} />
        </div>
    );
}
