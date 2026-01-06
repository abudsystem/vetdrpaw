import Link from 'next/link';
import React from 'react';
import { Appointment } from '@/types/appointment';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AppointmentMobileCard } from './AppointmentMobileCard';
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useTranslations, useLocale } from 'next-intl';

interface AppointmentListProps {
    appointments: Appointment[];
    onCancel: (id: string) => void;
}

export const AppointmentList = ({ appointments, onCancel }: AppointmentListProps) => {
    const t = useTranslations('ClientPanel.appointments');
    const tc = useTranslations('ClientPanel.common');
    const locale = useLocale();

    const {
        paginatedItems: paginatedAppointments,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(appointments, 10);

    const getStatusKey = (status: string) => {
        switch (status) {
            case 'pendiente': return 'table.pending';
            case 'aceptada': return 'table.accepted';
            case 'cancelada': return 'table.cancelled';
            case 'completado': return 'table.completed';
            default: return status;
        }
    };

    if (appointments.length === 0) {
        return (
            <div className="px-4 py-8 text-center text-gray-700 bg-white rounded-lg shadow">
                <p className="mb-4">{t('noAppointments')}</p>
                <Link
                    href="/cliente/citas/nueva"
                    className="text-teal-600 hover:text-teal-800 font-medium"
                >
                    {t('requestFirst')}
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedAppointments.map((appointment) => (
                    <AppointmentMobileCard
                        key={appointment._id}
                        appointment={appointment}
                        onCancel={onCancel}
                    />
                ))}
            </div>

            {/* Desktop View */}
            <Card className="hidden md:block text-black overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('table.dateTime')}</TableHead>
                            <TableHead>{t('table.pet')}</TableHead>
                            <TableHead>{t('table.veterinarian')}</TableHead>
                            <TableHead>{t('table.reason')}</TableHead>
                            <TableHead>{t('table.status')}</TableHead>
                            <TableHead>{tc('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedAppointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                                <TableCell>
                                    <div className="text-sm font-medium text-teal-700 capitalize">
                                        {new Date(appointment.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {new Date(appointment.date).toLocaleTimeString(locale === 'es' ? 'es-ES' : 'en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-700">
                                    {appointment.pet?.nombre || t('table.unknown')}
                                </TableCell>
                                <TableCell className="text-sm text-gray-700">
                                    {appointment.veterinarian?.name || t('table.unassigned')}
                                </TableCell>
                                <TableCell className="text-sm text-gray-700 max-w-xs truncate">
                                    {appointment.reason}
                                    {appointment.notas && appointment.status === 'completado' && (
                                        <div className="mt-1 text-xs text-gray-600 italic">
                                            {t('table.notes')}: {appointment.notas}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            appointment.status === 'aceptada' ? 'success' :
                                                appointment.status === 'cancelada' ? 'danger' :
                                                    appointment.status === 'completado' ? 'info' : 'warning'
                                        }
                                        className="capitalize"
                                    >
                                        {t(getStatusKey(appointment.status))}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {appointment.status === 'pendiente' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onCancel(appointment._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            {tc('cancel')}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
