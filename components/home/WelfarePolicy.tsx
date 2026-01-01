"use client";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function WelfarePolicy() {
    const t = useTranslations('WelfarePolicy');

    return (
        <div className="bg-[#0f172a] py-32 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-8">
                        {t('title')}
                    </h2>
                    <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-8 shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                    <p className="text-xl sm:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium italic">
                        "{t('description')}"
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16 flex justify-center items-center gap-4 text-teal-400 font-black tracking-[0.2em] uppercase text-xs"
                >
                    <div className="h-px w-8 bg-teal-500/30" />
                    <span>Compromiso Dr. Paw</span>
                    <div className="h-px w-8 bg-teal-500/30" />
                </motion.div>
            </div>
        </div>
    );
}
