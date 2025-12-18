import { Appointment } from "./types";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleCalendarButton from "@/components/GoogleCalendarButton";
import { useState } from "react";

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
    const [expandedReason, setExpandedReason] = useState(false);

    return (
        <div className="bg-white p-4 rounded-lg shadow border">
            {/* FECHA */}
            <p className="text-sm font-semibold text-gray-700">
                {new Date(appointment.date).toLocaleString()}
            </p>

            {/* PACIENTE */}
            <p className="mt-2 text-gray-900 font-medium">
                {appointment.pet?.nombre || "Paciente desconocido"}
            </p>

            {/* PROPIETARIO */}
            <p className="text-gray-600 text-sm">
                Propietario: {appointment.pet?.propietario?.name || "N/D"}
            </p>

            {/* ESPECIE · RAZA */}
            <p className="text-xs text-gray-700 capitalize">
                {appointment.pet?.especie || "N/D"}
                {appointment.pet?.raza && ` · ${appointment.pet.raza}`}
            </p>

            {/* MOTIVO (INLINE, CLICK PARA VER MÁS) */}
            <div className="mt-2 text-sm text-gray-700">
                {truncateText(appointment.reason, 40)}
            </div>

            <button
                onClick={() => setExpandedReason(!expandedReason)}
                className="text-gray-900 hover:text-indigo-900 text-xs underline mt-1"
            >
                {expandedReason ? "Ocultar motivo" : "Ver motivo completo"}
            </button>

            {expandedReason && (
                <div className="mt-1 text-xs text-gray-700">
                    {appointment.reason}
                </div>
            )}

            {/* VETERINARIO */}
            <p className="mt-2 text-gray-600 text-sm">
                Veterinario: {appointment.veterinarian?.name || "Sin asignar"}
            </p>

            {/* ESTADO */}
            <p className="mt-2">
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === "aceptada"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "cancelada"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {appointment.status}
                </span>
            </p>

            {/* ACCIONES */}
            <div className="flex flex-wrap gap-3 mt-4">
                <button
                    onClick={() => onUpdateStatus(appointment._id, "aceptada")}
                    className="text-green-600 font-semibold"
                >
                    Aceptar
                </button>

                <button
                    onClick={() => onUpdateStatus(appointment._id, "cancelada")}
                    className="text-red-600 font-semibold"
                >
                    Cancelar
                </button>

                <WhatsAppButton appointment={appointment} />
                <GoogleCalendarButton appointment={appointment} />
            </div>
        </div>
    );
}
