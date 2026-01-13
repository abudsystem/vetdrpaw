"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types/appointment";
import { AppointmentList } from "@/components/cliente/citas/AppointmentList";
import { AppointmentHeader } from "@/components/cliente/citas/AppointmentHeader";
import { useTranslations } from "next-intl";

export default function MyAppointmentsPage() {
  const t = useTranslations('ClientPanel.appointments');
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
    if (!confirm(t("cancelConfirm"))) return;

    try {
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelada" }),
      });

      if (res.ok) {
        fetchAppointments();
      } else {
        alert(t("cancelError"));
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert(t("cancelError"));
    }
  };

  return (
    <div>
      <AppointmentHeader />

      {loading ? (
        <p>{t("loading")}</p>
      ) : (
        <AppointmentList appointments={appointments} onCancel={handleCancel} />
      )}
    </div>
  );
}
