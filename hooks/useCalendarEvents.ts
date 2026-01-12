import { useState, useEffect } from "react";

export interface CalendarEventItem {
    _id: string;
    title: string | { es: string; en: string };
    date: string;
    description: string | { es: string; en: string };
    location?: string | { es: string; en: string };
    createdAt?: string;
}

export const useCalendarEvents = () => {
    const [events, setEvents] = useState<CalendarEventItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/calendar-events");
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const createEvent = async (data: Omit<CalendarEventItem, "_id">) => {
        const res = await fetch("/api/calendar-events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            await fetchEvents();
            return true;
        }
        return false;
    };

    const updateEvent = async (id: string, data: Partial<CalendarEventItem>) => {
        const res = await fetch(`/api/calendar-events/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            await fetchEvents();
            return true;
        }
        return false;
    };

    const deleteEvent = async (id: string) => {
        const res = await fetch(`/api/calendar-events/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            await fetchEvents();
            return true;
        }
        return false;
    };

    return {
        events,
        loading,
        createEvent,
        updateEvent,
        deleteEvent,
        refresh: fetchEvents,
    };
};
