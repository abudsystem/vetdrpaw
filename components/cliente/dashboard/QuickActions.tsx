import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';

export const QuickActions = () => {
    const t = useTranslations('ClientPanel.dashboard.quickActions');

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href="/cliente/mascotas"
                    className="flex items-center gap-4 p-4 border-2 border-teal-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all group"
                >
                    <div className="text-4xl">🐕</div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-teal-600">{t('newPet')}</h3>
                        <p className="text-sm text-gray-600">{t('newPetDesc')}</p>
                    </div>
                </Link>

                <Link
                    href="/cliente/citas/nueva"
                    className="flex items-center gap-4 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                    <div className="text-4xl">📅</div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">{t('newAppt')}</h3>
                        <p className="text-sm text-gray-600">{t('newApptDesc')}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};
