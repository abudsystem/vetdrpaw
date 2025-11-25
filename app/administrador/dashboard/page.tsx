"use client";

import { useEffect, useState } from "react";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function administradorDashboardPage() {
    const [stats, setStats] = useState({
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
                const administradors = users.filter(u => u.role === "administrador").length;

                setStats({
                    totalUsers: users.length,
                    vets,
                    clients
                });

                // Recent Registrations (Last 5)
                // Sort by createdAt desc if not already
                const sorted = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecentUsers(sorted.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching administrador dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Cargando panel de administradoristración...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Panel de administradoristración</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Total Usuarios</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Veterinarios</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.vets}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Clientes</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.clients}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Registros Recientes</h2>
                {recentUsers.length === 0 ? (
                    <p className="text-gray-500">No hay usuarios registrados recientemente.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'administrador' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'veterinario' ? 'bg-indigo-100 text-indigo-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
