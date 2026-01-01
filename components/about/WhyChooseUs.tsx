import React from "react";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";
import { Heart, Stethoscope, GraduationCap } from "lucide-react";

export const WhyChooseUs = () => {
    const t = useTranslations('About');

    const features = [
        {
            icon: <Heart className="w-10 h-10 text-white" />,
            title: t('customCare'),
            desc: t('customCareDesc'),
            gradient: "from-pink-500 to-rose-500 text-pink-500"
        },
        {
            icon: <GraduationCap className="w-10 h-10 text-white" />,
            title: t('trainedProf'),
            desc: t('trainedProfDesc'),
            gradient: "from-teal-500 to-emerald-500 text-teal-500"
        },
        {
            icon: <Stethoscope className="w-10 h-10 text-white" />,
            title: t('passion'),
            desc: t('passionDesc'),
            gradient: "from-blue-500 to-indigo-500 text-blue-500"
        }
    ];

    return (
        <div className="mb-32">
            <h2 className="text-4xl font-black text-gray-900 text-center mb-16 tracking-tight">
                {t('whyTitle')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="bg-white rounded-[2.5rem] p-10 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                    >
                        <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${feature.gradient} shadow-lg flex items-center justify-center transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 mb-8`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            {feature.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
