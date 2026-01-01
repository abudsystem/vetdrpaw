import React from "react";
import { useTranslations } from 'next-intl';

export const ContactHeader = () => {
    const t = useTranslations('Contact');

    return (
        <div className="text-center px-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                {t('title')}
            </h2>
            <div className="mt-6 w-24 h-1.5 bg-teal-500 mx-auto rounded-full shadow-[0_4px_12px_rgba(20,184,166,0.3)]" />
            <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                {t('description')}
            </p>
        </div>
    );
};
