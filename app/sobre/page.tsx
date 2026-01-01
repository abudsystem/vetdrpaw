"use client";

import { AboutHeader } from "@/components/about/AboutHeader";
import { Achievements } from "@/components/about/Achievements";
import { History } from "@/components/about/History";
import { MissionVision } from "@/components/about/MissionVision";
import { WhyChooseUs } from "@/components/about/WhyChooseUs";
import { GallerySection } from "@/components/about/GallerySection";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-50 rounded-full blur-3xl opacity-60 -z-10 translate-y-1/2 -translate-x-1/2" />

            {/* Header */}
            <AboutHeader />

            {/* Content */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-32 relative z-10">

                {/* Misión y Equipo */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <MissionVision />
                </motion.div>

                {/* Historia de la veterinaria */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <History />
                </motion.div>

                {/* ¿Por qué elegirnos? */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <WhyChooseUs />
                </motion.div>

                {/* Contador de logros */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Achievements />
                </motion.div>

                {/* Galería Dinámica */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <GallerySection />
                </motion.div>

            </div>
        </div>
    );
}
