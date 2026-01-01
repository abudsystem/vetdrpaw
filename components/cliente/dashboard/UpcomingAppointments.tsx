import Link from 'next/link';
import React from 'react';
import { Appointment } from '@/types/appointment';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Calendar, Clock, PawPrint } from 'lucide-react';

export const UpcomingAppointments = ({ appointments, loading }: { appointments: Appointment[], loading?: boolean }) => {
    const t = useTranslations('ClientPanel.dashboard');
    const tc = useTranslations('ClientPanel.common');
    const locale = useLocale();

    if (!loading && appointments.length === 0) return null;

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-none bg-transparent pb-2">
                <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-teal-500" />
                    {t('upcomingAppts')}
                </CardTitle>
                <Link href="/cliente/citas" className="group text-sm font-extrabold text-teal-600 flex items-center gap-1 hover:text-teal-700 transition-colors">
                    {tc('viewAll')}
                    <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-full mt-2" />
                            </div>
                        ))
                    ) : (
                        appointments.map((apt) => (
                            <div key={apt._id} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-teal-100 hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-full ${apt.status === 'aceptada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {apt.status}
                                    </span>
                                    <PawPrint className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors" />
                                </div>
                                <p className="font-extrabold text-gray-900 text-lg leading-tight capitalize">
                                    {new Date(apt.date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                                        weekday: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="flex items-center gap-1 text-sm font-bold text-gray-600">
                                        <Clock className="w-4 h-4 text-teal-500" />
                                        {new Date(apt.date).toLocaleTimeString(locale === 'es' ? 'es-ES' : 'en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <p className="text-sm font-bold text-gray-700 truncate">
                                        {apt.pet.nombre}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500 font-medium mt-3 line-clamp-2 italic">
                                    "{apt.reason}"
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
