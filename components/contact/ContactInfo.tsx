import { MapPin, Phone, Instagram, Facebook, Clock } from "lucide-react";
import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export const ContactInfo = () => {
    const t = useTranslations('Contact');

    return (
        <div className="bg-gray-50/50 p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-start space-y-12 h-full">
            {/* MAP SECTION */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full relative group"
            >
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative overflow-hidden rounded-[2rem] shadow-2xl bg-white aspect-video lg:aspect-square">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!4v1764086290294!6m8!1m7!1sxlmExxQi-UvCulORRqd1tA!2m2!1d-0.08449035659170309!2d-78.43360805276531!3f49.6542280937762!4f18.403214162726655!5f0.7820865974627469"
                        width="100%"
                        height="100%"
                        style={{ border: "0" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </motion.div>

            {/* INFO SECTION */}
            <div className="w-full space-y-8">
                <div className="space-y-6">
                    {/* Address */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-start gap-4"
                    >
                        <div className="flex-shrink-0 p-3 rounded-xl bg-teal-50 text-teal-600">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <a
                            href="https://maps.app.goo.gl/Zkupxkj23bzto3du5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-bold text-teal-700 hover:text-teal-800 hover:underline transition-colors"
                        >
                            {t('address')}
                        </a>
                    </motion.div>

                    {/* Phone */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-4"
                    >
                        <div className="flex-shrink-0 p-3 rounded-xl bg-teal-50 text-teal-600">
                            <Phone className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-black text-gray-900">099 539 8645</span>
                    </motion.div>
                </div>

                {/* Social Media */}
                <div className="pt-6 border-t border-gray-100 flex gap-4">
                    <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href="https://www.instagram.com/vet_drpaw/"
                        target="_blank"
                        className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 text-pink-600 shadow-sm border border-pink-100"
                    >
                        <Instagram className="w-6 h-6" />
                    </motion.a>
                    <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href="https://www.facebook.com/DrPawEc"
                        target="_blank"
                        className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100"
                    >
                        <Facebook className="w-6 h-6" />
                    </motion.a>
                </div>

                {/* Hours Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="p-8 rounded-[2rem] bg-gray-900 text-white shadow-xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Clock className="w-24 h-24" />
                    </div>

                    <h4 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-teal-400" />
                        {t('hoursTitle')}
                    </h4>

                    <div className="space-y-4">
                        <div>
                            <p className="text-teal-400 font-black tracking-widest text-xs uppercase mb-1">{t('regularHours')}</p>
                            <p className="text-lg font-bold">{t('regularHoursDetail')}</p>
                        </div>
                        <div className="h-px bg-white/10 w-12" />
                        <div>
                            <p className="text-red-400 font-black tracking-widest text-xs uppercase mb-1">{t('emergencyHours')}</p>
                            <p className="text-lg font-bold">{t('emergencyHoursDetail')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
