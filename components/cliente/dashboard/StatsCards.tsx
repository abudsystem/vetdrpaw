import Link from 'next/link';
import React from 'react';
import { ClientDashboardStats } from '@/types/dashboard';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/Skeleton';

export const StatsCards = ({ stats, loading }: { stats: ClientDashboardStats, loading?: boolean }) => {
    const t = useTranslations('ClientPanel.dashboard.stats');
    const tc = useTranslations('ClientPanel.common');

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mascotas Card */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-widest opacity-80">{t('pets')}</p>
                        {loading ? (
                            <Skeleton className="h-10 w-16 mt-2 bg-white/20" />
                        ) : (
                            <p className="text-4xl font-black mt-2 tracking-tight">{stats.totalPets}</p>
                        )}
                    </div>
                    <div className="text-5xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">🐾</div>
                </div>
                <Link href="/cliente/mascotas" className="relative z-10 text-xs font-bold mt-6 inline-flex items-center gap-1 hover:translate-x-1 transition-transform">
                    {tc('viewAll')}
                    <span className="text-lg">→</span>
                </Link>
            </div>

            {/* Citas Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-widest opacity-80">{t('upcoming')}</p>
                        {loading ? (
                            <Skeleton className="h-10 w-16 mt-2 bg-white/20" />
                        ) : (
                            <p className="text-4xl font-black mt-2 tracking-tight">{stats.upcomingAppointments}</p>
                        )}
                    </div>
                    <div className="text-5xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">📅</div>
                </div>
                <Link href="/cliente/citas" className="relative z-10 text-xs font-bold mt-6 inline-flex items-center gap-1 hover:translate-x-1 transition-transform">
                    {tc('viewAll')}
                    <span className="text-lg">→</span>
                </Link>
            </div>

            {/* Pendientes Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-extrabold uppercase tracking-widest opacity-80">{t('pending')}</p>
                        {loading ? (
                            <Skeleton className="h-10 w-16 mt-2 bg-white/20" />
                        ) : (
                            <p className="text-4xl font-black mt-2 tracking-tight">{stats.pendingAppointments}</p>
                        )}
                    </div>
                    <div className="text-5xl opacity-20 group-hover:opacity-40 transition-opacity duration-300">⏳</div>
                </div>
                <p className="relative z-10 text-xs font-bold mt-6 opacity-80">{t('waiting')}</p>
            </div>
        </div>
    );
};
