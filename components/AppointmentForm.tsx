"use client";

import { useState, useEffect } from "react";
import { createAppointment, updateAppointment } from "@/app/api/appointment";

interface Props {
  token: string;
  pets: { _id: string; nombre: string }[];
  veterinarians: { _id: string; name: string }[];
  onSaved: () => void;
  editing?: any; // objeto cita para editar
  onCancel?: () => void;
}

export default function AppointmentForm({ token, pets, veterinarians, onSaved, editing, onCancel }: Props) {
  const [petId, setPetId] = useState(editing?.pet?._id || "");
  const [vetId, setVetId] = useState(editing?.veterinarian?._id || "");
  const [date, setDate] = useState(editing ? new Date(editing.date).toISOString().slice(0,16) : "");
  const [reason, setReason] = useState(editing?.reason || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId || !vetId || !date || !reason) return alert("Todos los campos son obligatorios");
    setLoading(true);

    try {
      if (editing) {
        await updateAppointment(editing._id, { pet: petId, veterinarian: vetId, date, reason }, token);
      } else {
        await createAppointment({ pet: petId, veterinarian: vetId, date, reason }, token);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Error al guardar cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded">
      <select value={petId} onChange={(e) => setPetId(e.target.value)}>
        <option value="">Selecciona mascota</option>
        {pets.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
      </select>

      <select value={vetId} onChange={(e) => setVetId(e.target.value)}>
        <option value="">Selecciona veterinario</option>
        {veterinarians.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
      </select>

      <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="text" placeholder="Motivo" value={reason} onChange={(e) => setReason(e.target.value)} />

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
          {loading ? "Guardando..." : editing ? "Actualizar" : "Crear Cita"}
        </button>
        {editing && onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
