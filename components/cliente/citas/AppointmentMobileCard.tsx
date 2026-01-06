import Link from 'next/link';
import { Appointment } from '@/types/appointment';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useTranslations, useLocale } from 'next-intl';

interface AppointmentMobileCardProps {
    appointment: Appointment;
    onCancel: (id: string) => void;
}

export const AppointmentMobileCard = ({ appointment, onCancel }: AppointmentMobileCardProps) => {
    const t = useTranslations('ClientPanel.appointments');
    const tc = useTranslations('ClientPanel.common');
    const locale = useLocale();

    const getStatusKey = (status: string) => {
        switch (status) {
            case 'pendiente': return 'table.pending';
            case 'aceptada': return 'table.accepted';
            case 'cancelada': return 'table.cancelled';
            case 'completado': return 'table.completed';
            default: return status;
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <Badge
                        variant={
                            appointment.status === 'aceptada' ? 'success' :
                                appointment.status === 'cancelada' ? 'danger' :
                                    appointment.status === 'completado' ? 'info' : 'warning'
                        }
                        className="mb-1 capitalize"
                    >
                        {t(getStatusKey(appointment.status))}
                    </Badge>
                    <h3 className="font-semibold text-teal-600 capitalize">
                        {new Date(appointment.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h3>
                    <p className="text-sm text-gray-700">
                        {new Date(appointment.date).toLocaleTimeString(locale === 'es' ? 'es-ES' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">{t('table.pet')}</span>
                    <span className="font-medium">{appointment.pet?.nombre || t('table.unknown')}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">{t('table.veterinarian')}</span>
                    <span className="font-medium">{appointment.veterinarian?.name || t('table.unassigned')}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">{t('table.reason')}</span>
                    <span className="italic">{appointment.reason}</span>
                </div>
            </div>

            {appointment.notas && appointment.status === 'completado' && (
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200 text-sm">
                    <p className="text-gray-700">
                        <strong>{t('table.notes')}:</strong> {appointment.notas}
                    </p>
                </div>
            )}

            {appointment.status === 'pendiente' && (
                <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancel(appointment._id)}
                        className="text-red-600 hover:text-red-800 w-full justify-center"
                    >
                        {tc('cancel')}
                    </Button>
                </div>
            )}
        </div>
    );
};
