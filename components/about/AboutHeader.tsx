import React from "react";
import { useTranslations } from "next-intl";

export const AboutHeader = () => {
    const t = useTranslations("About");

    return (
        <div className="bg-teal-600 bg-cover bg-center bg-no-repeat  py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                    {t("headerTitle")}
                </h1>
                <p className="mt-6 text-xl text-teal-100 max-w-3xl mx-auto">
                    {t("headerDescription")}
                </p>
            </div>
        </div>
    );
};
