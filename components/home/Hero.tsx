"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Hero() {
    const t = useTranslations("Hero");

    return (
        <div className="relative overflow-hidden isolate">
            <Image
                src="/imagen2.jpg"
                alt="Fondo de mascota"
                fill
                priority
                className="object-cover object-center -z-10"
            />
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-teal-800 opacity-20" />
            </div>
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {t("title")}
                </h1>
                <p className="mt-6 text-xl text-teal-100 max-w-3xl">
                    {t("description")}
                </p>
                <div className="mt-10 flex space-x-4">
                    <Link
                        href="/contacto"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-teal-900 bg-teal-100 hover:bg-teal-200 transition-colors"
                    >
                        {t("contact")}
                    </Link>
                    <Link
                        href="/sobre"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-800 hover:bg-teal-700 transition-colors"
                    >
                        {t("about")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
