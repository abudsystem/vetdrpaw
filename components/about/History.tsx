import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { History as HistoryIcon } from "lucide-react";

export const History = () => {
    const t = useTranslations('About');

    return (
        <div className="relative mb-32 p-8 sm:p-12 rounded-[3rem] bg-gray-50 border border-gray-100 overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-teal-600">
                        <HistoryIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        {t('headerTitle')}
                    </h2>
                </div>

                <div className="prose prose-lg text-gray-600">
                    <p className="text-xl leading-relaxed font-medium">
                        {t('historyDesc')}
                    </p>
                </div>
            </div>
        </div>
    );
};
