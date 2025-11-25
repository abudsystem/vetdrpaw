// components/AppointmentDetails.tsx
"use client";

import { useState } from "react";
import { useAppointment } from "@/hooks/useAppointments";

interface Props {
  id: string;
}

export default function AppointmentDetails({ id }: Props) {
  const { appointment, loading, error, updateAppointment, deleteAppointment } = useAppointment(id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ date: "", reason: "", status: "" });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!appointment) return <p>No se encontró la cita</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const success = await updateAppointment(form);
    if (success) setEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("¿Eliminar esta cita?")) {
      await deleteAppointment();
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>Cita: {appointment._id}</h2>
      <p><strong>Mascota:</strong> {appointment.pet.nombre}</p>
      <p><strong>Veterinario:</strong> {appointment.veterinarian?.name || "No asignado"}</p>

      {editing ? (
        <>
          <input type="datetime-local" name="date" onChange={handleChange} defaultValue={appointment.date} />
          <input type="text" name="reason" onChange={handleChange} defaultValue={appointment.reason} />
          <select name="status" onChange={handleChange} defaultValue={appointment.status}>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          <button onClick={handleUpdate}>Guardar</button>
          <button onClick={() => setEditing(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleString()}</p>
          <p><strong>Motivo:</strong> {appointment.reason}</p>
          <p><strong>Estado:</strong> {appointment.status}</p>
          <button onClick={() => setEditing(true)}>Editar</button>
          <button onClick={handleDelete}>Eliminar</button>
        </>
      )}
    </div>
  );
}
