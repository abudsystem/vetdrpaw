"use client";

import React, { useEffect, useState } from "react";
import { GalleryService, GalleryImage } from "@/services/client/gallery.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { GalleryList } from "@/components/administrador/galeria/GalleryList";
import { Search } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function GalleryPage() {
    const t = useTranslations('AdminDashboard.gallery');
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState({ es: "", en: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        try {
            const data = await GalleryService.getAll();
            setImages(data);
        } catch (error) {
            console.error(t('error'), error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !title.es) return;

        setLoading(true);
        try {
            const base64 = await convertToBase64(selectedFile);
            await GalleryService.create({ title, imageUrl: base64 });
            setTitle({ es: "", en: "" });
            setSelectedFile(null);
            // Reset file input manually
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            await loadImages();
        } catch (error) {
            console.error(t('errorUpload'), error);
            alert(t('errorUpload'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('confirmDelete'))) return;
        try {
            await GalleryService.delete(id);
            await loadImages();
        } catch (error) {
            console.error(t('errorDelete'), error);
            alert(t('errorDelete'));
        }
    };

    const filteredImages = images.filter((image) => {
        if (typeof image.title === 'string') {
            return image.title.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return image.title.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.title.en.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>

            {/* Upload Form */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">{t('addImage')}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="title-es">{t('titleEs')}</Label>
                                <Input
                                    id="title-es"
                                    type="text"
                                    value={title.es}
                                    onChange={(e) => setTitle(prev => ({ ...prev, es: e.target.value }))}
                                    placeholder={t('placeholderEs')}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="title-en">{t('titleEn')}</Label>
                                <Input
                                    id="title-en"
                                    type="text"
                                    value={title.en}
                                    onChange={(e) => setTitle(prev => ({ ...prev, en: e.target.value }))}
                                    placeholder={t('placeholderEn')}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="file-upload">{t('image')}</Label>
                            <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                            {loading ? t('button.uploading') : t('button.upload')}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('searchPlaceholder')}
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Images List */}
            <GalleryList images={filteredImages} onDelete={handleDelete} />
        </div>
    );
}
