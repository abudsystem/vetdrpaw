"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Appointment {
    _id: string;
    date: string;
    status: string;
    pet: { nombre: string; especie: string };
    veterinarian: { name: string };
}

interface Pet {
    _id: string;
}

export default function VetDashboardPage() {
    const [stats, setStats] = useState({
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

    if (loading) return <div className="p-6">Cargando dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Resumen de la Clínica</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Citas Hoy</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.appointmentsToday}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Pacientes Totales</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activePatients}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm font-medium uppercase">Citas Pendientes</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingAppointments}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link href="/veterinario/citas" className="bg-indigo-600 text-white p-4 rounded-lg shadow hover:bg-indigo-700 text-center font-bold transition-colors">
                    + Nueva Cita
                </Link>
                <Link href="/veterinario/mascotas" className="bg-white text-indigo-600 border border-indigo-600 p-4 rounded-lg shadow hover:bg-indigo-50 text-center font-bold transition-colors">
                    Ver Pacientes
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Actividad Reciente (Citas)</h2>
                {recentActivity.length === 0 ? (
                    <p className="text-gray-500">No hay actividad reciente.</p>
                ) : (
                    <ul className="space-y-4">
                        {recentActivity.map((appt) => (
                            <li key={appt._id} className="flex items-center text-gray-600 border-b pb-2 last:border-0">
                                <span className={`w-3 h-3 rounded-full mr-3 ${appt.status === 'aceptada' ? 'bg-green-500' :
                                        appt.status === 'cancelada' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}></span>
                                <div>
                                    <span className="font-semibold">{new Date(appt.date).toLocaleDateString()}</span> -
                                    Cita con <span className="font-bold">{appt.pet?.nombre || 'Mascota'}</span> ({appt.status})
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
