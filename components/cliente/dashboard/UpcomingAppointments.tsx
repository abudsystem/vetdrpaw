import Link from 'next/link';
import React from 'react';
import { Appointment } from '@/types/appointment';
import { useTranslations } from 'next-intl';

export const UpcomingAppointments = ({ appointments }: { appointments: Appointment[] }) => {
    const t = useTranslations('ClientPanel');
    if (appointments.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{t('dashboard.upcomingAppts')}</h2>
                <Link href="/cliente/citas" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    {t('common.viewAll')}
                </Link>
            </div>
            <div className="space-y-3">
                {appointments.map((apt) => (
                    <div key={apt._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">
                                    {new Date(apt.date).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    🕒 {new Date(apt.date).toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })} • 🐾 {apt.pet.nombre}
                                </p>
                                <p className="text-xs text-gray-700 mt-1">{apt.reason}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${apt.status === 'aceptada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {apt.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
