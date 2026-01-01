import React from "react";
import { useTranslations } from 'next-intl';

export const PetCareHeader = () => {
    const t = useTranslations('PetCare');

    return (
        <div className="text-center px-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                {t('title')}
            </h2>
            <div className="mt-8 w-24 h-1.5 bg-teal-500 mx-auto rounded-full shadow-[0_4px_12px_rgba(20,184,166,0.3)]" />
            <p className="mt-10 max-w-2xl text-xl text-gray-600 font-medium leading-relaxed mx-auto">
                {t('description')}
            </p>
        </div>
    );
};
