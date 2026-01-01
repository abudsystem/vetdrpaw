"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useState, useEffect } from "react";
import { useLocale } from 'next-intl';
import { motion } from "framer-motion";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface CalendarEvent {
    _id: string;
    title: string;
    date: string;
    description: string;
    location?: string;
}

export default function CalendarContent() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
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

        fetchEvents();
    }, []);

    const handleEventClick = (info: any) => {
        info.jsEvent.preventDefault();
        const event = events.find(e => e.title === info.event.title && e.date === info.event.startStr);
        if (!event) return;

        // Format dates for Google Calendar (YYYYMMDD)
        const dateStr = event.date.replace(/-/g, "");

        // Calculate end date (next day) for all-day event
        const startDate = new Date(event.date + "T00:00:00");
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, "");

        const googleUrl = new URL("https://www.google.com/calendar/render");
        googleUrl.searchParams.append("action", "TEMPLATE");
        googleUrl.searchParams.append("text", event.title);
        googleUrl.searchParams.append("dates", `${dateStr}/${endDateStr}`);
        googleUrl.searchParams.append("details", event.description);
        if (event.location) {
            googleUrl.searchParams.append("location", event.location);
        }

        window.open(googleUrl.toString(), "_blank");
    };

    if (loading) {
        return (
            <div className="p-4">
                <CardSkeleton className="h-[500px] rounded-3xl" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white text-black shadow-2xl rounded-[2.5rem] p-6 sm:p-8 border border-gray-100"
        >
            <style jsx global>{`
                .fc {
                    --fc-button-bg-color: #0d9488;
                    --fc-button-border-color: #0d9488;
                    --fc-button-hover-bg-color: #0f766e;
                    --fc-button-hover-border-color: #0f766e;
                    --fc-button-active-bg-color: #115e59;
                    --fc-button-active-border-color: #115e59;
                    --fc-event-bg-color: #ccfbf1;
                    --fc-event-border-color: #5eead4;
                    --fc-event-text-color: #115e59;
                    font-family: inherit;
                }
                .fc-toolbar-title {
                    font-weight: 900 !important;
                    font-size: 1.5rem !important;
                    letter-spacing: -0.025em !important;
                    color: #111827;
                }
                .fc-button {
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    font-size: 0.75rem !important;
                    letter-spacing: 0.05em !important;
                    border-radius: 1rem !important;
                    padding: 0.6em 1.2em !important;
                }
                .fc-daygrid-day-number {
                    font-weight: 700 !important;
                    padding: 8px !important;
                }
                .fc-event {
                    border-radius: 6px !important;
                    padding: 2px 4px !important;
                    font-weight: 700 !important;
                    font-size: 0.85em !important;
                }
            `}</style>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={locale === 'es' ? esLocale : 'en'}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                }}
                events={events.map(e => ({
                    title: e.title,
                    date: e.date,
                }))}
                height="auto"
                fixedWeekCount={false}
                eventClick={handleEventClick}
                eventMouseEnter={(info) => {
                    info.el.style.cursor = 'pointer';
                }}
            />
        </motion.div>
    );
}
