import { Appointment } from "./types";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleCalendarButton from "@/components/GoogleCalendarButton";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

interface AppointmentMobileCardProps {
    appointment: Appointment;
    onUpdateStatus: (id: string, status: string) => void;
}

const truncateText = (text: string, maxLength = 40) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

export default function AppointmentMobileCard({
    appointment,
    onUpdateStatus,
}: AppointmentMobileCardProps) {
    const t = useTranslations('VetPanel.appointments');
    const tb = useTranslations('VetPanel.appointments.table');
    const ta = useTranslations('ClientPanel.appointments.table');
    const tc = useTranslations('ClientPanel.common');
    const locale = useLocale();
    const [expandedReason, setExpandedReason] = useState(false);

    const getStatusKey = (status: string) => {
        switch (status) {
            case 'pendiente': return 'pending';
            case 'aceptada': return 'accepted';
            case 'cancelada': return 'cancelled';
            case 'completado': return 'completed';
            default: return status;
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border overflow-hidden">
            {/* FECHA */}
            <p className="text-sm font-semibold text-gray-700 capitalize">
                {new Date(appointment.date).toLocaleString(locale === 'es' ? 'es-ES' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </p>

            {/* PACIENTE */}
            <p className="mt-2 text-gray-900 font-medium">
                {appointment.pet?.nombre || t('unknownPet')}
            </p>

            {/* PROPIETARIO */}
            <p className="text-gray-600 text-sm">
                {t('owner')}: {appointment.pet?.propietario?.name || tb('notDefined')}
            </p>

            {/* ESPECIE · RAZA */}
            <p className="text-xs text-gray-700 capitalize">
                {appointment.pet?.especie || tb('notDefined')}
                {appointment.pet?.raza && ` · ${appointment.pet.raza}`}
            </p>

            {/* MOTIVO (INLINE, CLICK PARA VER MÁS) */}
            <div className="mt-2 text-sm text-gray-700 break-words">
                {truncateText(appointment.reason, 40)}
            </div>

            <button
                onClick={() => setExpandedReason(!expandedReason)}
                className="text-gray-900 hover:text-indigo-900 text-xs underline mt-1"
            >
                {expandedReason ? tb('hideFull') : tb('viewFull')}
            </button>

            {expandedReason && (
                <div className="mt-1 text-xs text-gray-700 break-words">
                    {appointment.reason}
                </div>
            )}

            {/* VETERINARIO */}
            <p className="mt-2 text-gray-600 text-sm">
                {t('veterinarian')}: {appointment.veterinarian?.name || ta('unassigned')}
            </p>

            {/* ESTADO */}
            <p className="mt-2">
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${appointment.status === "aceptada"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "cancelada"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {ta(getStatusKey(appointment.status))}
                </span>
            </p>

            {/* ACCIONES */}
            <div className="flex flex-wrap gap-3 mt-4">
                <button
                    onClick={() => onUpdateStatus(appointment._id, "aceptada")}
                    className="text-green-600 font-semibold"
                >
                    {tb('accept')}
                </button>

                <button
                    onClick={() => onUpdateStatus(appointment._id, "cancelada")}
                    className="text-red-600 font-semibold"
                >
                    {tb('cancel')}
                </button>

                <button
                    onClick={() => onUpdateStatus(appointment._id, "completado")}
                    className="text-blue-600 font-semibold"
                >
                    {tb('complete')}
                </button>

                <WhatsAppButton appointment={appointment} />
                <GoogleCalendarButton appointment={appointment} />
            </div>
        </div>
    );
}
