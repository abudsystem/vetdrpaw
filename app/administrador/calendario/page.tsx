"use client";

import { useState } from "react";
import { useCalendarEvents, CalendarEventItem } from "@/hooks/useCalendarEvents";
import { CalendarEventList } from "@/components/administrador/calendar/CalendarEventList";
import CalendarEventForm from "@/components/administrador/calendar/CalendarEventForm";
import { Plus, X, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminCalendarPage() {
    const t = useTranslations('AdminDashboard.calendar');
    const { events, loading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEventItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleCreate = async (data: Omit<CalendarEventItem, "_id">) => {
        const success = await createEvent(data);
        if (success) {
            setIsFormOpen(false);
        } else {
            alert(t("alertError"));
        }
    };

    const handleUpdate = async (data: Omit<CalendarEventItem, "_id">) => {
        if (!editingEvent) return;
        const success = await updateEvent(editingEvent._id, data);
        if (success) {
            setEditingEvent(null);
            setIsFormOpen(false);
        } else {
            alert(t("alertError"));
        }
    };

    const handleEdit = (event: CalendarEventItem) => {
        setEditingEvent(event);
        setIsFormOpen(true);
    };

    const handleCancel = () => {
        setEditingEvent(null);
        setIsFormOpen(false);
    };

    const filteredEvents = events.filter((event) => {
        const titleMatch = typeof event.title === 'string'
            ? event.title.toLowerCase().includes(searchTerm.toLowerCase())
            : (event.title.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.title.en.toLowerCase().includes(searchTerm.toLowerCase()));

        const descMatch = typeof event.description === 'string'
            ? event.description.toLowerCase().includes(searchTerm.toLowerCase())
            : (event.description.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.en.toLowerCase().includes(searchTerm.toLowerCase()));

        return titleMatch || descMatch;
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow-md min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
                    <p className="text-gray-500 text-sm mt-1">{t("description")}</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        {t("newEvent")}
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {editingEvent ? t("editEvent") : t("registerEvent")}
                        </h2>
                        <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    <CalendarEventForm
                        initialData={editingEvent || undefined}
                        onSubmit={editingEvent ? handleUpdate : handleCreate}
                        onCancel={handleCancel}
                        isEditing={!!editingEvent}
                    />
                </div>
            ) : (
                <>
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t("placeholder")}
                                className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                        </div>
                    ) : (
                        <CalendarEventList
                            events={filteredEvents}
                            onEdit={handleEdit}
                            onDelete={deleteEvent}
                        />
                    )}
                </>
            )}
        </div>
    );
}
