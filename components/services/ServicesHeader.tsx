import React from "react";
import { useTranslations } from "next-intl";

export const ServicesHeader = () => {
    const t = useTranslations("Services");

    return (
        <div className="text-center">
            <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">
                {t("title")}
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {t("subtitle")}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-700 mx-auto">
                {t("description")}
            </p>
        </div>
    );
};
