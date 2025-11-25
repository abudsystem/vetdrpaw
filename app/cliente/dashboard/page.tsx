"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
    totalPets: number;
    upcomingAppointments: number;
    pendingAppointments: number;
}

interface Pet {
    _id: string;
    nombre: string;
    especie: string;
    edad?: number;
    fotoUrl?: string;
}

interface Appointment {
    _id: string;
    date: string;
    reason: string;
    status: string;
    pet: { nombre: string };
    veterinarian?: { name: string };
}

export default function ClientDashboard() {
    const [stats, setStats] = useState<Stats>({ totalPets: 0, upcomingAppointments: 0, pendingAppointments: 0 });
    const [pets, setPets] = useState<Pet[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
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

    const getSpeciesEmoji = (especie: string) => {
        const especieLower = especie.toLowerCase();
        if (especieLower.includes('perro')) return '🐕';
        if (especieLower.includes('gato')) return '🐈';
        return '🐾';
    };

    if (loading) {
        return <div className="p-8">Cargando dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Mi Panel</h1>
                <p className="text-gray-600 mt-1">Bienvenido a tu panel de control</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Mis Mascotas</p>
                            <p className="text-3xl font-bold mt-2">{stats.totalPets}</p>
                        </div>
                        <div className="text-4xl opacity-80">🐾</div>
                    </div>
                    <Link href="/cliente/mascotas" className="text-xs mt-4 inline-block hover:underline">
                        Ver todas →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Citas Próximas</p>
                            <p className="text-3xl font-bold mt-2">{stats.upcomingAppointments}</p>
                        </div>
                        <div className="text-4xl opacity-80">📅</div>
                    </div>
                    <Link href="/cliente/citas" className="text-xs mt-4 inline-block hover:underline">
                        Ver todas →
                    </Link>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-90">Citas Pendientes</p>
                            <p className="text-3xl font-bold mt-2">{stats.pendingAppointments}</p>
                        </div>
                        <div className="text-4xl opacity-80">⏳</div>
                    </div>
                    <p className="text-xs mt-4 opacity-90">Esperando confirmación</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/cliente/mascotas"
                        className="flex items-center gap-4 p-4 border-2 border-teal-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all group"
                    >
                        <div className="text-4xl">🐕</div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">Nueva Mascota</h3>
                            <p className="text-sm text-gray-600">Registra una nueva mascota</p>
                        </div>
                    </Link>

                    <Link
                        href="/cliente/citas/nueva"
                        className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                        <div className="text-4xl">📅</div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">Nueva Cita</h3>
                            <p className="text-sm text-gray-600">Agenda una consulta veterinaria</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Upcoming Appointments */}
            {appointments.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Próximas Citas</h2>
                        <Link href="/cliente/citas" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                            Ver todas →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {appointments.map((apt) => (
                            <div key={apt._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">
                                            {new Date(apt.date).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            🕒 {new Date(apt.date).toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} • 🐾 {apt.pet.nombre}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{apt.reason}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${apt.status === 'aceptada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pets Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Mis Mascotas</h2>
                    <Link href="/cliente/mascotas" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                        Ver todas →
                    </Link>
                </div>

                {pets.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="mb-4">Aún no has registrado ninguna mascota</p>
                        <Link
                            href="/cliente/mascotas"
                            className="inline-block bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
                        >
                            Registrar mi primera mascota
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pets.map((pet) => (
                            <Link
                                key={pet._id}
                                href={`/cliente/mascotas`}
                                className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-teal-300 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-4xl">
                                        {getSpeciesEmoji(pet.especie)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">
                                            {pet.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-600">{pet.especie}</p>
                                        {pet.edad !== undefined && (
                                            <p className="text-xs text-gray-500">{pet.edad} años</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
