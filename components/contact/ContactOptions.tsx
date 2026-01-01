import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { MessageSquare, Calendar, AlertTriangle, Monitor, Smartphone } from "lucide-react";

export const ContactOptions = () => {
    const t = useTranslations('Contact');

    const contactSections = [
        {
            title: t('generalQuery'),
            icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
            color: 'teal',
            mobileUrl: "https://wa.me/593995398645?text=Hola%20DrPaw%2C%20tengo%20una%20consulta%20sobre%20mi%20mascota.",
            pcUrl: "https://web.whatsapp.com/send?phone=593995398645&text=Hola%20DrPaw%2C%20tengo%20una%20consulta%20sobre%20mi%20mascota."
        },
        {
            title: t('bookCita'),
            icon: <Calendar className="w-6 h-6 text-blue-600" />,
            color: 'blue',
            mobileUrl: "https://wa.me/593995398645?text=Hola%20DrPaw%2C%20quisiera%20agendar%20una%20cita%20para%20mi%20mascota.",
            pcUrl: "https://web.whatsapp.com/send?phone=593995398645&text=Hola%20DrPaw%2C%20quisiera%20agendar%20una%20cita%20para%20mi%20mascota."
        },
        {
            title: t('emergency'),
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            color: 'red',
            isEmergency: true,
            mobileUrl: "https://wa.me/593995398645?text=Hola%20DrPaw%2C%20tengo%20una%20emergencia%20con%20mi%20mascota%2C%20por%20favor%20ayuda.",
            pcUrl: "https://web.whatsapp.com/send?phone=593995398645&text=Hola%20DrPaw%2C%20tengo%20una%20emergencia%20con%20mi%20mascota%2C%20por%20favor%20ayuda."
        }
    ];

    return (
        <div className="p-8 sm:p-12 lg:p-16 border-r border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-10">{t('sendMessage')}</h3>

            <div className="space-y-12">
                {contactSections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl ${section.isEmergency ? 'bg-red-50' :
                                    section.color === 'blue' ? 'bg-blue-50' : 'bg-teal-50'
                                }`}>
                                {section.icon}
                            </div>
                            <p className={`text-lg font-black tracking-tight ${section.isEmergency ? 'text-red-700' : 'text-gray-900'}`}>
                                {section.title}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a
                                href={section.mobileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-xl active:scale-95 ${section.isEmergency ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-200' :
                                        'bg-gray-900 text-white hover:bg-gray-800'
                                    }`}
                            >
                                <Smartphone className="w-5 h-5" />
                                {t('mobile')}
                            </a>
                            <a
                                href={section.pcUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all duration-300 border-2 hover:shadow-lg active:scale-95 ${section.isEmergency ? 'border-red-100 bg-red-50 text-red-700 hover:bg-red-100' :
                                        'border-gray-100 bg-white text-gray-700 hover:border-teal-100 hover:bg-teal-50/30'
                                    }`}
                            >
                                <Monitor className="w-5 h-5 opacity-60" />
                                {t('pc')}
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
