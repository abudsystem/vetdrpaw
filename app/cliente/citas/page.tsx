"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Appointment {
  _id: string;
  date: string;
  reason: string;
  status: string;
  notas?: string;
  veterinarian?: { name: string };
  pet: { nombre: string };
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments?my_appointments=true");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("¿Estás seguro de cancelar esta cita?")) return;

    try {
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelada" }),
      });

      if (res.ok) {
        fetchAppointments();
      } else {
        alert("Error al cancelar la cita");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Error al cancelar la cita");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aceptada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mis Citas</h1>
        <Link
          href="/cliente/citas/nueva"
          className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">📅</span>
          Nueva Cita
        </Link>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-teal-600 truncate">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} - {new Date(appointment.date).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </p>
                      {appointment.status === 'pendiente' && (
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        🐾 Mascota: {appointment.pet?.nombre || 'Desconocida'}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        👨‍⚕️ Veterinario: {appointment.veterinarian?.name || 'Por asignar'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <p>
                      📝 Motivo: {appointment.reason}
                    </p>
                  </div>
                  {appointment.notas && appointment.status === 'completada' && (
                    <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong>Notas del veterinario:</strong> {appointment.notas}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
            {appointments.length === 0 && (
              <li className="px-4 py-8 text-center text-gray-500">
                <p className="mb-4">No tienes citas programadas.</p>
                <Link
                  href="/cliente/citas/nueva"
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
                  Solicita tu primera cita →
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
