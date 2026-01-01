import React from 'react';
import { VetDashboardStats } from '@/types/dashboard';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/Skeleton';
import { Calendar, Users, Clock } from 'lucide-react';

export const DashboardStats = ({ stats, loading }: { stats: VetDashboardStats, loading?: boolean }) => {
    const t = useTranslations('VetPanel.dashboard.stats');

    const statCards = [
        {
            label: t('appointmentsToday'),
            value: stats.appointmentsToday,
            color: 'indigo',
            icon: <Calendar className="w-5 h-5 text-indigo-500" />
        },
        {
            label: t('activePatients'),
            value: stats.activePatients,
            color: 'emerald',
            icon: <Users className="w-5 h-5 text-emerald-500" />
        },
        {
            label: t('pendingAppointments'),
            value: stats.pendingAppointments,
            color: 'amber',
            icon: <Clock className="w-5 h-5 text-amber-500" />
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statCards.map((stat) => (
                <Card
                    key={stat.label}
                    className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] overflow-hidden`}
                >
                    <div className={`h-1.5 w-full bg-${stat.color === 'indigo' ? 'indigo' : stat.color === 'emerald' ? 'emerald' : 'amber'}-500`} />
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
                            <div className={`p-2 rounded-xl bg-${stat.color === 'indigo' ? 'indigo' : stat.color === 'emerald' ? 'emerald' : 'amber'}-50`}>
                                {stat.icon}
                            </div>
                        </div>
                        {loading ? (
                            <Skeleton className="h-10 w-24 mt-2" />
                        ) : (
                            <p className="text-4xl font-black text-gray-900 mt-2 tracking-tight">
                                {stat.value}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
