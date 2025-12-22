"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

export default function Calendar() {
    const t = useTranslations("Calendar");

    const CalendarContent = dynamic(() => import("./CalendarContent"), {
        loading: () => <div className="h-96 bg-white rounded-xl shadow-lg flex items-center justify-center">{t("loading")}</div>,
        ssr: false
    });

    return (
        <div className="flex flex-col bg-teal-900 min-h-screen">
            {/* Calendario de Eventos */}
            <div className="max-w-6xl mx-auto w-full px-4 py-16">
                <h2 className="text-3xl font-bold text-gray-200 mb-6 text-center">
                    {t("title")}
                </h2>
                <CalendarContent />
            </div>
        </div>
    );
}
