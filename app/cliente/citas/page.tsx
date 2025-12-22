"use client";

import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentList } from "@/components/cliente/citas/AppointmentList";
import { AppointmentHeader } from "@/components/cliente/citas/AppointmentHeader";
import { useTranslations } from "next-intl";

export default function MyAppointmentsPage() {
  const t = useTranslations('ClientPanel');
  const { appointments, loading, cancelAppointment } = useAppointments();

  const handleCancel = async (id: string) => {
    if (!confirm(t('appointments.cancelConfirm'))) return;

    try {
      await cancelAppointment(id);
      alert(t('appointments.cancelSuccess'));
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert(t('appointments.cancelError'));
    }
  };

  return (
    <div>
      <AppointmentHeader />

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <AppointmentList appointments={appointments} onCancel={handleCancel} />
      )}
    </div>
  );
}
