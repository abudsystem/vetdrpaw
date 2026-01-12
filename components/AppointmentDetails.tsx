// components/AppointmentDetails.tsx
"use client";

import { useState } from "react";
import { useAppointment } from "@/hooks/useAppointments";

interface Props {
  id: string;
}

import { useTranslations } from 'next-intl';

export default function AppointmentDetails({ id }: Props) {
  const { appointment, loading, error, updateAppointment, deleteAppointment } = useAppointment(id);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ date: "", reason: "", status: "" });
  const t = useTranslations('AppointmentDetails');

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!appointment) return <p>{t('notFound')}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const success = await updateAppointment(form);
    if (success) setEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(t('confirmDelete'))) {
      await deleteAppointment();
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>{t('appointmentId', { id: appointment._id })}</h2>
      <p><strong>{t('petLabel')}:</strong> {appointment.pet.nombre}</p>
      <p><strong>{t('vetLabel')}:</strong> {appointment.veterinarian?.name || t('unassigned')}</p>

      {editing ? (
        <>
          <input type="datetime-local" name="date" onChange={handleChange} defaultValue={appointment.date} />
          <input type="text" name="reason" onChange={handleChange} defaultValue={appointment.reason} />
          <select name="status" onChange={handleChange} defaultValue={appointment.status}>
            <option value="pendiente">{t('status.pending')}</option>
            <option value="confirmada">{t('status.confirmed')}</option>
            <option value="cancelada">{t('status.cancelled')}</option>
          </select>
          <button onClick={handleUpdate}>{t('saveButton')}</button>
          <button onClick={() => setEditing(false)}>{t('cancelButton')}</button>
        </>
      ) : (
        <>
          <p><strong>{t('dateLabel')}:</strong> {new Date(appointment.date).toLocaleString()}</p>
          <p><strong>{t('reasonLabel')}:</strong> {appointment.reason}</p>
          <p><strong>{t('statusLabel')}:</strong> {appointment.status}</p>
          <button onClick={() => setEditing(true)}>{t('editButton')}</button>
          <button onClick={handleDelete}>{t('deleteButton')}</button>
        </>
      )}
    </div>
  );
}
