import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export const AboutHeader = () => {
    const t = useTranslations('About');

    return (
        <div className="relative py-32 lg:py-48 flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-800/80 mix-blend-multiply" />
                <img
                    src="/imagen2.webp"
                    alt="About Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 drop-shadow-lg">
                        {t('headerTitle')}
                    </h1>
                    <div className="w-24 h-2 bg-white/20 backdrop-blur-md mx-auto rounded-full mb-8" />
                    <p className="text-xl sm:text-2xl text-teal-50 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
                        {t('headerDescription')}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
