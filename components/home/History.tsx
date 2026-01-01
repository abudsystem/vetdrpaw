"use client";
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function History() {
    const t = useTranslations('History');

    const timeline = [
        { year: '2018', event: t('event2018') },
        { year: '2025', event: t('event2025') },
        { year: '2026', event: t('event2026') },
    ];

    return (
        <div className="bg-gray-50 py-32 lg:py-40 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-teal-100 rounded-full blur-3xl opacity-30 -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">{t('title')}</h2>
                    <div className="mt-4 w-24 h-1.5 bg-teal-500 mx-auto rounded-full" />
                    <p className="mt-6 text-xl text-gray-600 font-medium max-w-2xl mx-auto">{t('subtitle')}</p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto px-4">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-200 via-teal-500 to-teal-200 md:-translate-x-1/2 rounded-full" />

                    <div className="space-y-20">
                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className={`relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Year bubble on line */}
                                <div className="absolute left-0 md:left-1/2 top-0 md:top-auto w-8 h-8 bg-white border-4 border-teal-500 rounded-full shadow-lg md:-translate-x-1/2 md:translate-y-0 z-10" />

                                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16 md:text-right'
                                    }`}>
                                    <div className="inline-block px-4 py-1 rounded-full bg-teal-50 text-teal-600 font-black text-lg mb-3 shadow-sm border border-teal-100">
                                        {item.year}
                                    </div>
                                    <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                        {item.event}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
