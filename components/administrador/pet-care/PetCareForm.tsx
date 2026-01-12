"use client";

import { useState, useEffect } from "react";
import { PetCareItem } from "@/hooks/usePetCare";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { BookOpen, Tag, AlignLeft, Link as LinkIcon, Calendar } from "lucide-react";

interface PetCareFormProps {
    initialData?: Partial<PetCareItem>;
    onSubmit: (data: Omit<PetCareItem, "_id">) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function PetCareForm({ initialData, onSubmit, onCancel, isEditing = false }: PetCareFormProps) {
    const t = useTranslations('AdminDashboard.petCare.form');
    const tc = useTranslations('ClientPanel.common');

    const [formData, setFormData] = useState({
        title: { es: "", en: "" },
        excerpt: { es: "", en: "" },
        category: { es: "", en: "" },
        link: "",
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || { es: "", en: "" },
                excerpt: initialData.excerpt || { es: "", en: "" },
                category: initialData.category || { es: "", en: "" },
                link: initialData.link || "",
                date: initialData.date || "",
            });
        }
    }, [initialData]);

    const handleNestedChange = (field: 'title' | 'category' | 'excerpt', lang: 'es' | 'en', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData as any);
            toast.success(isEditing ? "Artículo actualizado con éxito" : "Artículo creado con éxito", {
                description: formData.title.es
            });
        } catch (error) {
            toast.error("Error al guardar el artículo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Español</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={`${t('titleLabel')} (ES)`}
                        required
                        icon={<BookOpen className="w-5 h-5" />}
                        value={formData.title.es}
                        onChange={(e) => handleNestedChange('title', 'es', e.target.value)}
                    />
                    <Input
                        label={`${t('categoryLabel')} (ES)`}
                        required
                        icon={<Tag className="w-5 h-5" />}
                        placeholder={t('categoryPlaceholder')}
                        value={formData.category.es}
                        onChange={(e) => handleNestedChange('category', 'es', e.target.value)}
                    />
                </div>
                <Input
                    label={`${t('excerptLabel')} (ES)`}
                    required
                    multiline
                    rows={3}
                    icon={<AlignLeft className="w-5 h-5" />}
                    value={formData.excerpt.es}
                    onChange={(e) => handleNestedChange('excerpt', 'es', e.target.value)}
                />
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">English</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label={`${t('titleLabel')} (EN)`}
                        required
                        icon={<BookOpen className="w-5 h-5" />}
                        value={formData.title.en}
                        onChange={(e) => handleNestedChange('title', 'en', e.target.value)}
                    />
                    <Input
                        label={`${t('categoryLabel')} (EN)`}
                        required
                        icon={<Tag className="w-5 h-5" />}
                        placeholder="e.g. Preventive Care"
                        value={formData.category.en}
                        onChange={(e) => handleNestedChange('category', 'en', e.target.value)}
                    />
                </div>
                <Input
                    label={`${t('excerptLabel')} (EN)`}
                    required
                    multiline
                    rows={3}
                    icon={<AlignLeft className="w-5 h-5" />}
                    value={formData.excerpt.en}
                    onChange={(e) => handleNestedChange('excerpt', 'en', e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <Input
                    label={t('linkLabel')}
                    name="link"
                    type="url"
                    required
                    icon={<LinkIcon className="w-5 h-5" />}
                    value={formData.link}
                    onChange={handleChange}
                />
                <Input
                    label={t('dateLabel')}
                    name="date"
                    required
                    icon={<Calendar className="w-5 h-5" />}
                    value={formData.date}
                    onChange={handleChange}
                />
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    {tc('cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                >
                    {isEditing ? t('updateArticle') : t('createArticle')}
                </Button>
            </div>
        </form>
    );
}
