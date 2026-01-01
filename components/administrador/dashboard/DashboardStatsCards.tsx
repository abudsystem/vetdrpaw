import React from 'react';
import { AdminDashboardStats } from '@/types/dashboard';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/Skeleton';

export const DashboardStatsCards = ({ stats, loading }: { stats: AdminDashboardStats, loading?: boolean }) => {
    const t = useTranslations('AdminDashboard.dashboard.stats');

    const statCards = [
        {
            label: t('totalUsers'),
            value: stats.totalUsers,
            color: 'teal'
        },
        {
            label: t('vets'),
            value: stats.vets,
            color: 'cyan'
        },
        {
            label: t('clients'),
            value: stats.clients,
            color: 'emerald'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {statCards.map((stat, index) => (
                <div
                    key={stat.label}
                    className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] ${stat.color === 'teal' ? 'border-teal-500' :
                        stat.color === 'cyan' ? 'border-cyan-500' :
                            'border-emerald-500'
                        }`}
                >
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                        {stat.label}
                    </h3>
                    {loading ? (
                        <Skeleton className="h-10 w-20 mt-2" />
                    ) : (
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {stat.value}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

