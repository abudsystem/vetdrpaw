"use client";

import React from "react";
import { CalendarEventItem } from "@/hooks/useCalendarEvents";
import { Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface CalendarEventListProps {
    events: CalendarEventItem[];
    onEdit: (event: CalendarEventItem) => void;
    onDelete: (id: string) => void;
}

export const CalendarEventList = ({ events, onEdit, onDelete }: CalendarEventListProps) => {
    const t = useTranslations('AdminDashboard.calendar');
    const tc = useTranslations('ClientPanel.common');

    if (events.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-bold">{t('noEvents')}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-50 text-left">
                        <th className="py-3 px-4 border-b font-bold text-gray-700">{t('table.title')}</th>
                        <th className="py-3 px-4 border-b font-bold text-gray-700">{t('table.date')}</th>
                        <th className="py-3 px-4 border-b font-bold text-gray-700">{t('table.description')}</th>
                        <th className="py-3 px-4 border-b font-bold text-gray-700 text-right">{tc('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 border-b text-gray-800 font-bold">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon size={16} className="text-teal-600" />
                                    {event.title}
                                </div>
                            </td>
                            <td className="py-3 px-4 border-b text-gray-700 font-bold font-mono text-sm">
                                {event.date}
                            </td>
                            <td className="py-3 px-4 border-b text-gray-700 font-bold text-sm max-w-xs truncate">
                                {event.description}
                            </td>
                            <td className="py-3 px-4 border-b text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(event)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title={tc('edit')}
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm(t('confirmDelete'))) {
                                                onDelete(event._id);
                                            }
                                        }}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title={tc('delete')}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
