// hooks/useAppointments.ts
import { useState, useEffect } from "react";

export function useAppointment(id: string) {
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cliente/citas/${id}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAppointment(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (updateData: any) => {
    try {
      const res = await fetch(`/api/cliente/citas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAppointment(data.data);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteAppointment = async () => {
    try {
      const res = await fetch(`/api/cliente/citas/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAppointment(null);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  return { appointment, loading, error, fetchAppointment, updateAppointment, deleteAppointment };
}
