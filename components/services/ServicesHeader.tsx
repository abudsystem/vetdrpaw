import React from "react";
import { useTranslations } from 'next-intl';

export const ServicesHeader = () => {
    const t = useTranslations('Services');

    return (
        <div className="text-center px-4">
            <h2 className="text-xs font-black text-teal-600 tracking-[0.3em] uppercase mb-4">
                {t('title')}
            </h2>
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight">
                {t('subtitle')}
            </p>
            <div className="mt-8 w-24 h-1.5  mx-auto rounded-full shadow-[0_4px_12px_rgba(20,184,166,0.3)]" />
            <p className="mt-10 max-w-2xl text-xl text-gray-600 font-medium leading-relaxed mx-auto">
                {t('description')}
            </p>
        </div>
    );
};
