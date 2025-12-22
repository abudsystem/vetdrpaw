"use client";

import React, { useState } from "react";
import { GalleryService, GalleryImage } from "@/lib/api/gallery.service";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

export const GallerySection = () => {
    const t = useTranslations("About");
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasFetched, setHasFetched] = useState(false);

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
        <ScrollReveal onVisible={loadImages} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {t("galleryTitle")}
                    </h2>
                    <p className="mt-4 text-lg text-gray-700">
                        {t("galleryDesc")}
                    </p>
                </div>

                {loading ? (
                    <div className="py-12 bg-gray-50 text-center animate-pulse">
                        <p className="text-gray-700">{t("loadingGallery")}</p>
                    </div>
                ) : images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img._id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                                <div className="aspect-w-3 aspect-h-2 relative h-64">
                                    <img
                                        src={img.imageUrl}
                                        alt={img.title}
                                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {img.title}
                                    </p>
                                    <p className="text-xs text-gray-700 mt-1">
                                        {new Date(img.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <p className="text-gray-700">{t("noImages")}</p>
                    </div>
                )}
            </div>
        </ScrollReveal>
    );
};
