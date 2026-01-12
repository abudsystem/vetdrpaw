"use client";

import { useState, useEffect } from "react";
import { CalendarEventItem } from "@/hooks/useCalendarEvents";
import { useTranslations } from "next-intl";

interface CalendarEventFormProps {
    initialData?: Partial<CalendarEventItem>;
    onSubmit: (data: Omit<CalendarEventItem, "_id">) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

export default function CalendarEventForm({ initialData, onSubmit, onCancel, isEditing = false }: CalendarEventFormProps) {
    const t = useTranslations('AdminDashboard.calendar.form');
    const tc = useTranslations('ClientPanel.common');

    const [formData, setFormData] = useState({
        title: { es: "", en: "" },
        date: new Date().toISOString().split('T')[0],
        description: { es: "", en: "" },
        location: { es: "", en: "" },
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            const normalize = (val: string | { es: string; en: string } | undefined) => {
                if (!val) return { es: "", en: "" };
                if (typeof val === 'string') return { es: val, en: "" };
                return { es: val.es || "", en: val.en || "" };
            };

            setFormData({
                title: normalize(initialData.title as any),
                date: initialData.date || new Date().toISOString().split('T')[0],
                description: normalize(initialData.description as any),
                location: normalize(initialData.location as any),
            });
        }
    }, [initialData]);

    const handleNestedChange = (field: 'title' | 'description' | 'location', lang: 'es' | 'en', value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: { ...prev[field], [lang]: value }
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, date: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Ensure we send the data in the correct format
        await onSubmit(formData as any);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">{t('titleLabel')} (ES)</label>
                    <input
                        type="text"
                        required
                        placeholder={t('titlePlaceholder')}
                        value={formData.title.es}
                        onChange={(e) => handleNestedChange('title', 'es', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">{t('titleLabel')} (EN)</label>
                    <input
                        type="text"
                        required
                        placeholder="Event Title (English)"
                        value={formData.title.en}
                        onChange={(e) => handleNestedChange('title', 'en', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                </div>
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-bold text-gray-700">{t('dateLabel')}</label>
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleDateChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                />
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">{t('descriptionLabel')} (ES)</label>
                    <textarea
                        required
                        rows={3}
                        placeholder={t('descriptionPlaceholder')}
                        value={formData.description.es}
                        onChange={(e) => handleNestedChange('description', 'es', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">{t('descriptionLabel')} (EN)</label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Description (English)"
                        value={formData.description.en}
                        onChange={(e) => handleNestedChange('description', 'en', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700">{t('locationLabel')} (ES)</label>
                    <input
                        type="text"
                        placeholder={t('locationPlaceholder')}
                        value={formData.location.es}
                        onChange={(e) => handleNestedChange('location', 'es', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700">{t('locationLabel')} (EN)</label>
                    <input
                        type="text"
                        placeholder="Location (English)"
                        value={formData.location.en}
                        onChange={(e) => handleNestedChange('location', 'en', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-bold"
                >
                    {tc('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 font-bold"
                >
                    {loading ? tc('guardando') : isEditing ? t('updateEvent') : t('createEvent')}
                </button>
            </div>
        </form>
    );
}
