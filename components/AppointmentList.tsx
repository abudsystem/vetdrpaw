"use client";

import { useEffect, useState } from "react";
import { ClientAppointmentService } from "@/services/client/client-appointment.service";
import AppointmentForm from "./AppointmentForm";

interface Props {
  token: string;
  pets: { _id: string; nombre: string }[];
  veterinarians: { _id: string; name: string }[];
}

export default function AppointmentList({ token, pets, veterinarians }: Props) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await ClientAppointmentService.getAppointments(token);
      setAppointments(data);
    } catch (err) {
      console.error(err);
      alert("Error al obtener citas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Deseas eliminar esta cita?")) return;
    try {
      await ClientAppointmentService.deleteAppointment(id, token);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cita");
    }
  };

  if (loading) return <p>Cargando citas...</p>;
  if (appointments.length === 0) return <p>No hay citas disponibles.</p>;

  return (
    <div className="flex flex-col gap-4">
      {editing && (
        <AppointmentForm
          token={token}
          pets={pets}
          veterinarians={veterinarians}
          editing={editing}
          onSaved={() => { setEditing(null); fetchAppointments(); }}
          onCancel={() => setEditing(null)}
        />
      )}
      {appointments.map(a => (
        <div key={a._id} className="border p-2 rounded flex flex-col gap-1">
          <p><strong>Mascota:</strong> {a.pet.nombre}</p>
          <p><strong>Veterinario:</strong> {a.veterinarian.name}</p>
          <p><strong>Fecha:</strong> {new Date(a.date).toLocaleString()}</p>
          <p><strong>Motivo:</strong> {a.reason}</p>
          <p><strong>Estado:</strong> {a.status}</p>

          <div className="flex gap-2 mt-1">
            <button onClick={() => setEditing(a)} className="bg-yellow-500 text-white p-1 rounded">Editar</button>
            <button onClick={() => handleDelete(a._id)} className="bg-red-500 text-white p-1 rounded">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
