import React from 'react';
import { Appointment } from '@/types/appointment';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/Skeleton';
import { Activity, History, ChevronRight } from 'lucide-react';

export const RecentActivity = ({ appointments, loading }: { appointments: Appointment[], loading?: boolean }) => {
    const t = useTranslations('VetPanel.dashboard.recentActivity');

    const getStatusKey = (status: string) => {
        switch (status) {
            case 'pendiente': return 'status.pending';
            case 'aceptada': return 'status.accepted';
            case 'cancelada': return 'status.cancelled';
            case 'completada': return 'status.completed';
            default: return status;
        }
    };

    return (
        <Card className="border-none shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-none bg-transparent pb-2">
                <CardTitle className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <History className="w-6 h-6 text-teal-500" />
                    {t('title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <Activity className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-bold text-lg">{t('noActivity')}</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {appointments.map((appointment) => (
                            <li
                                key={appointment._id}
                                className="group p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-teal-100 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${appointment.status === 'cancelada' ? 'bg-red-50 text-red-500' :
                                                appointment.status === 'aceptada' ? 'bg-emerald-50 text-emerald-500' :
                                                    appointment.status === 'completada' ? 'bg-blue-50 text-blue-500' :
                                                        'bg-amber-50 text-amber-500'
                                            }`}>
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-gray-900 leading-tight">
                                                {appointment.pet?.nombre || t('deletedPet')}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">
                                                {appointment.pet?.especie || 'N/A'} • {t(getStatusKey(appointment.status))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-right mr-2 hidden sm:block">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Cita con</p>
                                            <p className="text-sm font-black text-teal-600">
                                                {appointment.pet?.nombre || t('deletedPet')}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};
