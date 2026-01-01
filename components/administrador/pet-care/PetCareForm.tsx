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
        title: "",
        excerpt: "",
        category: "",
        link: "",
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                excerpt: initialData.excerpt || "",
                category: initialData.category || "",
                link: initialData.link || "",
                date: initialData.date || "",
            });
        }
    }, [initialData]);

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
                description: formData.title
            });
        } catch (error) {
            toast.error("Error al guardar el artículo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label={t('titleLabel')}
                    name="title"
                    required
                    icon={<BookOpen className="w-5 h-5" />}
                    value={formData.title}
                    onChange={handleChange}
                />
                <Input
                    label={t('categoryLabel')}
                    name="category"
                    required
                    icon={<Tag className="w-5 h-5" />}
                    placeholder={t('categoryPlaceholder')}
                    value={formData.category}
                    onChange={handleChange}
                />
            </div>

            <Input
                label={t('excerptLabel')}
                name="excerpt"
                required
                multiline
                rows={4}
                icon={<AlignLeft className="w-5 h-5" />}
                value={formData.excerpt}
                onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
