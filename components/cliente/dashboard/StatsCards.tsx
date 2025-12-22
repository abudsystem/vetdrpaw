import Link from 'next/link';
import React from 'react';
import { ClientDashboardStats } from '@/types/dashboard';
import { useTranslations } from 'next-intl';

export const StatsCards = ({ stats }: { stats: ClientDashboardStats }) => {
    const t = useTranslations('ClientPanel');

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-90">{t('dashboard.stats.pets')}</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalPets}</p>
                    </div>
                    <div className="text-4xl opacity-80">🐾</div>
                </div>
                <Link href="/cliente/mascotas" className="text-xs mt-4 inline-block hover:underline">
                    {t('common.viewAll')}
                </Link>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-90">{t('dashboard.stats.upcoming')}</p>
                        <p className="text-3xl font-bold mt-2">{stats.upcomingAppointments}</p>
                    </div>
                    <div className="text-4xl opacity-80">📅</div>
                </div>
                <Link href="/cliente/citas" className="text-xs mt-4 inline-block hover:underline">
                    {t('common.viewAll')}
                </Link>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium opacity-90">{t('dashboard.stats.pending')}</p>
                        <p className="text-3xl font-bold mt-2">{stats.pendingAppointments}</p>
                    </div>
                    <div className="text-4xl opacity-80">⏳</div>
                </div>
                <p className="text-xs mt-4 opacity-90">{t('dashboard.stats.waiting')}</p>
            </div>
        </div>
    );
};
