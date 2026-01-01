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
        title: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
        location: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                date: initialData.date || new Date().toISOString().split('T')[0],
                description: initialData.description || "",
                location: initialData.location || "",
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
        await onSubmit(formData as any);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700">{t('titleLabel')}</label>
                <input
                    type="text"
                    name="title"
                    required
                    placeholder={t('titlePlaceholder')}
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700">{t('dateLabel')}</label>
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700">{t('descriptionLabel')}</label>
                <textarea
                    name="description"
                    required
                    rows={3}
                    placeholder={t('descriptionPlaceholder')}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700">{t('locationLabel')}</label>
                <input
                    type="text"
                    name="location"
                    placeholder={t('locationPlaceholder')}
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 font-bold focus:ring-teal-500 focus:border-teal-500 text-black"
                />
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
