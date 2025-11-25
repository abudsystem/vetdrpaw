"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
export default function Calendar() {

    const [events] = useState([
        {
            title: "Vacunación antirrábica",
            date: "2025-11-26",
        },
        {
            title: "Desparasitación general",
            date: "2025-12-10",
        },
        {
            title: "Control veterinario anual",
            date: "2025-07-15",
        },
        {
            title: "Vacuna polivalente",
            date: "2025-03-20",
        },
    ]);

    return (
        <div className="flex flex-col bg-teal-900 min-h-screen">

            {/* Calendario de Eventos */}
            <div className="max-w-6xl mx-auto w-full px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
                    Calendario de Vacunación y Desparasitación
                </h2>

                <div className="bg-white text-black shadow-lg rounded-xl p-4">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "",
                        }}
                        events={events}
                        height="auto"
                        fixedWeekCount={false}
                    />
                </div>
            </div>
        </div>
    );
}
