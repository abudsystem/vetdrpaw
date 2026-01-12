import Link from 'next/link';
import React from 'react';
import { useTranslations } from 'next-intl';

export const InventoryHeader = () => {
    const t = useTranslations('AdminDashboard.inventoryBackup');

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
            <Link
                href="/administrador/inventario/nuevo"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors font-bold"
            >
                {t('newProduct')}
            </Link>
        </div>
    );
};
