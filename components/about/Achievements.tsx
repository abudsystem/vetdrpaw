import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export const Achievements = () => {
    const t = useTranslations('About');

    const stats = [
        { value: "+5", label: t('yearsExp') },
        { value: "+1200", label: t('petsServed') },
        { value: "UTA", label: t('profTraining') }
    ];

    return (
        <div className="relative py-16 mb-24">
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 px-8 py-16 sm:p-20 text-center">
                    <h2 className="text-3xl font-black text-white mb-16 tracking-tight">
                        {t('achievementsTitle')}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2, type: "spring" }}
                                className="relative"
                            >
                                <div className="text-6xl font-black text-white mb-4 drop-shadow-md">
                                    {stat.value}
                                </div>
                                <p className="text-teal-100 font-bold text-lg tracking-wide uppercase">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
