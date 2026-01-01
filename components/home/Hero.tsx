"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <div className="relative overflow-hidden isolate min-h-[80vh] flex items-center">
            {/* Background Image with Parallax effect (simulated via motion) */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 -z-10"
            >
                <Image
                    src="/imagen2.webp"
                    alt="Fondo de mascota"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
            </motion.div>

            {/* Premium Gradient Overlay */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-950/80 via-teal-900/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent pointer-events-none" />
            </div>

            <div className="relative max-w-7xl mx-auto py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                            {t('title').split('<br />')[0]} <br />
                            <span className="text-teal-300 drop-shadow-sm">
                                {t('title').split('<br />')[1] || ''}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-8 text-xl sm:text-2xl text-teal-50/90 max-w-2xl leading-relaxed font-medium"
                    >
                        {t('description')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-12 flex flex-col sm:flex-row gap-5"
                    >
                        <Link
                            href="/contacto"
                            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-black rounded-2xl text-teal-900 bg-white hover:bg-teal-50 transition-all duration-300 shadow-xl shadow-teal-900/20 active:scale-95"
                        >
                            {t('contact')}
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/sobre"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-black rounded-2xl text-white border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 active:scale-95"
                        >
                            {t('about')}
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block"
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
}

