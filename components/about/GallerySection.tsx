"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GalleryService, GalleryImage } from "@/lib/api/gallery.service";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Loader2 } from "lucide-react";

export const GallerySection = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);
    const t = useTranslations('About');

    const loadImages = async () => {
        if (hasFetched) return;
        setHasFetched(true);

        try {
            const data = await GalleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error("Error loading gallery images:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            onViewportEnter={loadImages}
            className="py-24 bg-gray-50/50 rounded-[3rem] border border-gray-100 relative overflow-hidden"
        >
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-white rounded-2xl shadow-sm text-teal-600">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight sm:text-5xl mb-6">
                        {t('galleryTitle')}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t('galleryDesc')}
                    </p>
                </div>

                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-teal-600">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">{t('loadingGallery')}</p>
                    </div>
                ) : images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {images.map((img, index) => (
                                <motion.div
                                    key={img._id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white aspect-[4/3] cursor-pointer"
                                    whileHover={{ y: -5 }}
                                >
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <p className="text-white font-bold text-lg truncate transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {img.title}
                                        </p>
                                        <p className="text-teal-200 text-sm mt-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                            {new Date(img.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg font-medium">{t('noImages')}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
