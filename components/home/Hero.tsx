"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    const t = useTranslations("Hero");

    return (
        <section className="relative isolate h-[80vh] flex items-center overflow-hidden">
            {/* ✅ LCP IMAGE — SSR, priority, no motion */}
            <Image
                src="/imagen2.webp"
                alt="Fondo de mascota"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center -z-10"
            />

            {/* Animated overlay (SAFE) */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 -z-10"
            />

            {/* Gradients */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-950/80 via-teal-900/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
                    >
                        {t("title").split("<br />")[0]} <br />
                        <span className="text-teal-300">
                            {t("title").split("<br />")[1]}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 text-xl sm:text-2xl text-teal-50/90 max-w-2xl"
                    >
                        {t("description")}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex flex-col sm:flex-row gap-5"
                    >
                        <Link
                            href="/contacto"
                            className="group inline-flex items-center justify-center px-8 py-4 text-lg font-black rounded-2xl text-teal-900 bg-white"
                        >
                            {t("contact")}
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/sobre"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-black rounded-2xl text-white border-2 border-white/30 bg-white/10 backdrop-blur-md"
                        >
                            {t("about")}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
