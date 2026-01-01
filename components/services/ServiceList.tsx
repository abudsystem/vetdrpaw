import React from "react";
import { ServiceCard, ServiceSection } from "./ServiceCard";
import { useTranslations } from 'next-intl';
import { motion } from "framer-motion";

export const ServiceList = () => {
    const t = useTranslations('Services');

    const services: ServiceSection[] = [
        {
            category: t('categories.veterinary'),
            items: [
                t('items.general'),
                t('items.emergency'),
                t('items.growth'),
                t('items.geriatric'),
                t('items.postop'),
                t('items.followup'),
            ],
        },
        {
            category: t('categories.vaccination'),
            items: [
                t('items.vaccines'),
                t('items.internal'),
                t('items.external'),
                t('items.preventive'),
                t('items.products'),
            ],
        },
        {
            category: t('categories.surgery'),
            items: [
                t('items.sterilization'),
                t('items.softTissue'),
                t('items.trauma'),
                t('items.eye'),
                t('items.emergencySurgery'),
            ],
        },
        {
            category: t('categories.hospitalization'),
            items: [
                t('items.monitoring'),
                t('items.fluids'),
            ],
        },
        {
            category: t('categories.complementary'),
            items: [
                t('items.food'),
                t('items.vetProducts'),
                t('items.grooming'),
                t('items.nails'),
                t('items.toys'),
                t('items.spa'),
            ],
        },
        {
            category: t('categories.certificates'),
            items: [
                t('items.certVaccines'),
                t('items.certInternal'),
                t('items.certSurgery'),
                t('items.certHospital'),
                t('items.certAdoption'),
                t('items.travel'),
            ],
        }
    ];

    return (
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {services.map((section, index) => (
                <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                    <ServiceCard section={section} />
                </motion.div>
            ))}
        </div>
    );
};
