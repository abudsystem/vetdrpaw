import React from "react";
import { useTranslations } from "next-intl";

export const ContactHeader = () => {
    const t = useTranslations("Contact");

    return (
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t("title")}
            </h2>
            <p className="mt-4 text-lg text-gray-700">
                {t("description")}
            </p>
        </div>
    );
};
