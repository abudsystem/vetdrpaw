"use client";
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Values() {
    const t = useTranslations('Values');

    const values = [
        {
            title: t('compassionTitle'),
            description: t('compassionText'),
            image: "/compacion.webp",
        },
        {
            title: t('excellenceTitle'),
            description: t('excellenceText'),
            image: "/Excelencia.webp",
        },
        {
            title: t('integrityTitle'),
            description: t('integrityText'),
            image: "/integridad.webp",
        },
    ];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-teal-50 py-32 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-xs font-black text-teal-600 tracking-[0.3em] uppercase mb-4">{t('sectionTitle')}</h2>
                    <p className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
                        {t('subtitle')}
                    </p>
                    <div className="mt-4 w-24 h-1.5 bg-teal-500 mx-auto rounded-full" />
                </motion.div>

                <div className="mt-24">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-500 h-[28rem] cursor-pointer"
                            >
                                {/* Background Image with Overlay */}
                                <Image
                                    src={value.image}
                                    alt={value.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay - Multi-layered for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-teal-900/20 mix-blend-overlay group-hover:bg-teal-900/40 transition-colors duration-500" />

                                {/* Content */}
                                <div className="relative h-full flex flex-col justify-end p-10">
                                    <div className="transform transition-all duration-500 group-hover:translate-y-[-10px]">
                                        <h3 className="text-3xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-200 text-lg leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 max-h-0 group-hover:max-h-32 overflow-hidden">
                                            {value.description}
                                        </p>
                                        <p className="text-gray-300 text-base leading-relaxed font-medium group-hover:opacity-0 transition-opacity duration-500 line-clamp-2">
                                            {value.description}
                                        </p>

                                        {/* Decorative Element */}
                                        <div className="mt-6 w-12 h-1.5 bg-teal-400 rounded-full transform origin-left transition-all duration-500 group-hover:w-20 group-hover:bg-teal-300" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
