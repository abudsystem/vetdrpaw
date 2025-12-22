import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export const AppointmentHeader = () => {
    const t = useTranslations('ClientPanel');

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{t('appointments.title')}</h1>
            <Link href="/cliente/citas/nueva">
                <Button className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    {t('appointments.newAppt')}
                </Button>
            </Link>
        </div>
    );
};
