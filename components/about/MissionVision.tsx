import Image from "next/image";
import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { Target, Users } from "lucide-react";

export const MissionVision = () => {
    const t = useTranslations('About');

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center mb-32">
            <div className="space-y-16">
                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative pl-8 border-l-4 border-teal-500"
                >
                    <div className="absolute -left-10 top-0 p-3 bg-teal-50 rounded-2xl text-teal-600">
                        <Target className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        {t('missionTitle')}
                    </h2>
                    <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">
                        {t('missionDescription')}
                    </p>
                </motion.div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative pl-8 border-l-4 border-blue-500"
                >
                    <div className="absolute -left-10 top-0 p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        {t('teamTitle')}
                    </h2>
                    <p className="mt-6 text-xl text-gray-600 leading-relaxed font-medium">
                        {t('teamDescription')}
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-16 lg:mt-0 relative"
            >
                <div className="absolute inset-0 bg-teal-200 rounded-[3rem] transform rotate-6 scale-95 opacity-30" />
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                    <Image
                        src="/imagenveterinarionueva.webp"
                        alt="Equipo"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            </motion.div>
        </div>
    );
};
