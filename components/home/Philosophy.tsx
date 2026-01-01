"use client";

import Image from "next/image";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function Philosophy() {
    const t = useTranslations('Philosophy');

    return (
        <div className="bg-white py-32 lg:py-40 overflow-hidden relative">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-teal-50 rounded-full blur-3xl -z-10 opacity-60" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            {t('title')}
                        </h2>
                        <p className="mt-8 text-xl text-gray-600 leading-relaxed font-medium">
                            {t('description')}
                        </p>

                        <div className="mt-12 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex items-start"
                            >
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-50 text-teal-600 shadow-sm border border-teal-100">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="ml-6">
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">{t('preventiveTitle')}</h4>
                                    <p className="mt-2 text-lg text-gray-500 font-medium leading-relaxed">{t('preventiveText')}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="flex items-start"
                            >
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-50 text-teal-600 shadow-sm border border-teal-100">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                </div>
                                <div className="ml-6">
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">{t('techTitle')}</h4>
                                    <p className="mt-2 text-lg text-gray-500 font-medium leading-relaxed">{t('techText')}</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 40 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="mt-16 lg:mt-0 relative"
                    >
                        {/* Premium frame for image */}
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                            <Image
                                src="/image.webp"
                                alt="Philosophy"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-teal-950/20 to-transparent" />
                        </div>

                        {/* Decorative badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-4 hidden sm:flex"
                        >
                            <div className="h-12 w-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-black text-2xl">
                                🐾
                            </div>
                            <div>
                                <p className="text-gray-900 font-black text-lg leading-none">Excelencia</p>
                                <p className="text-teal-600 font-bold text-sm mt-1">Garantizada</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
