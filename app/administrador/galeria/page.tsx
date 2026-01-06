"use client";

import React, { useEffect, useState } from "react";
import { GalleryService, GalleryImage } from "@/lib/api/gallery.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { GalleryList } from "@/components/administrador/galeria/GalleryList";
import { Search } from "lucide-react";

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
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
            console.error("Error loading images:", error);
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
        if (!selectedFile || !title) return;

        setLoading(true);
        try {
            const base64 = await convertToBase64(selectedFile);
            await GalleryService.create({ title, imageUrl: base64 });
            setTitle("");
            setSelectedFile(null);
            // Reset file input manually
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            await loadImages();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error al subir la imagen");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;
        try {
            await GalleryService.delete(id);
            await loadImages();
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Error al eliminar la imagen");
        }
    };

    const filteredImages = images.filter(
        (image) =>
            image.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Galería de Imágenes</h1>

            {/* Upload Form */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Subir Nueva Imagen</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: Fachada de la clínica"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="file-upload">Imagen</Label>
                            <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white">
                            {loading ? "Subiendo..." : "Subir Imagen"}
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
                        placeholder="Buscar por título..."
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Images List */}
            <GalleryList images={filteredImages} onDelete={handleDelete} />
        </div>
    );
}
