import { Appointment } from "./types";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleCalendarButton from "@/components/GoogleCalendarButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { calculateAge } from "@/lib/dateUtils";

interface AppointmentTableProps {
    appointments: Appointment[];
    onUpdateStatus: (id: string, status: string) => void;
    onViewReason: (reason: string, pet: string, date: string) => void;
    highlightId?: string | null;
}

const truncateText = (text: string, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default function AppointmentTable({
    appointments,
    onUpdateStatus,
    onViewReason,
    highlightId,
}: AppointmentTableProps) {
    const t = useTranslations('VetPanel.appointments.table');
    const tc = useTranslations('ClientPanel.common');
    const ta = useTranslations('ClientPanel.appointments.table');
    const locale = useLocale();

    // ✅ EL STATE VA AQUÍ
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const [expandedReasonId, setExpandedReasonId] = useState<string | null>(null);

    const [selectedPet, setSelectedPet] = useState<any | null>(null);

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
        <div className="hidden md:block bg-white shadow sm:rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-black">{t('dateTime')}</TableHead>
                        <TableHead className="text-black">{t('patient')}</TableHead>
                        <TableHead className="text-black">{t('reason')}</TableHead>
                        <TableHead className="text-black">{t('detail')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((app) => {
                        const fecha = new Date(app.date);
                        const fechaTexto = fecha.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US');
                        const horaTexto = fecha.toLocaleTimeString(locale === 'es' ? 'es-ES' : 'en-US', { hour: "2-digit", minute: "2-digit" });

                        const isHighlighted = highlightId === app._id;

                        return (
                            <TableRow
                                key={app._id}
                                id={`appointment-${app._id}`}
                                className={isHighlighted ? 'bg-teal-50 ring-4 ring-teal-400 animate-pulse' : ''}
                            >
                                {/* FECHA */}
                                <TableCell className="whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{fechaTexto}</span>
                                        <span className="text-gray-700">{horaTexto}</span>
                                    </div>
                                </TableCell>

                                {/* PACIENTE (CLICK PARA VER MÁS) */}
                                <TableCell className="whitespace-nowrap">
                                    <div
                                        className="text-sm font-medium text-gray-900 cursor-pointer hover:underline inline-block"
                                        onClick={() =>
                                            setExpandedId(expandedId === app._id ? null : app._id)
                                        }
                                    >
                                        {app.pet?.nombre}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        {app.pet?.propietario?.name}
                                    </div>

                                    {expandedId === app._id && (
                                        <div className="text-xs text-black">
                                            <div className="capitalize">
                                                {app.pet?.especie}
                                                {app.pet?.raza && ` · ${app.pet.raza}`}
                                            </div>

                                            <div>
                                                {t('age')}: {calculateAge(app.pet?.fechaNacimiento, app.pet?.edad ? Number(app.pet.edad) : undefined, tc)}
                                            </div>
                                        </div>
                                    )}
                                </TableCell>

                                {/* MOTIVO */}

                                <TableCell className="text-sm text-gray-700">
                                    <div className="max-w-[220px]">
                                        {truncateText(app.reason, 30)}
                                    </div>

                                    <button
                                        onClick={() =>
                                            setExpandedReasonId(
                                                expandedReasonId === app._id ? null : app._id
                                            )
                                        }
                                        className="text-gray-900 hover:text-indigo-900 text-xs underline mt-1"
                                    >
                                        {t('viewFull')}
                                    </button>

                                    {expandedReasonId === app._id && (
                                        <div className="mt-1 text-xs text-gray-700 max-w-[220px]">
                                            {app.reason}
                                        </div>
                                    )}
                                </TableCell>


                                {/* DETALLE */}
                                <TableCell className="text-sm text-gray-700">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900 mb-1">
                                            {app.veterinarian?.name || ta('unassigned')}
                                        </span>

                                        <div className="mb-2">
                                            <Badge
                                                variant={
                                                    app.status === "aceptada"
                                                        ? "success"
                                                        : app.status === "cancelada"
                                                            ? "danger"
                                                            : "warning"
                                                }
                                                className="capitalize"
                                            >
                                                {ta(getStatusKey(app.status))}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onUpdateStatus(app._id, "aceptada")}
                                                className="text-green-600 hover:text-green-900 justify-start px-0 h-auto py-0.5"
                                            >
                                                {t('accept')}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onUpdateStatus(app._id, "cancelada")}
                                                className="text-red-600 hover:text-red-900 justify-start px-0 h-auto py-0.5"
                                            >
                                                {t('cancel')}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onUpdateStatus(app._id, "completado")}
                                                className="text-blue-600 hover:text-blue-900 justify-start px-0 h-auto py-0.5"
                                            >
                                                {t('complete')}
                                            </Button>

                                            <div className="mt-1 flex flex-col gap-1">
                                                <WhatsAppButton appointment={app} />
                                                <GoogleCalendarButton appointment={app} />
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
