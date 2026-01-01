"use client";

import { ServiceList } from "@/components/services/ServiceList";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { motion } from "framer-motion";

export default function ServicesPage() {
    return (
        <div className="bg-white min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10 -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-blue-50 rounded-full blur-3xl opacity-60 -z-10 translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <ServicesHeader />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-20"
                >
                    <ServiceList />
                </motion.div>
            </div>
        </div>
    );
}
