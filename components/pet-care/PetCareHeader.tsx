import React from "react";
import { useTranslations } from "next-intl";

export const PetCareHeader = () => {
    const t = useTranslations("PetCare");

    return (
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-700 mx-auto">
                {t("description")}
            </p>
        </div>
    );
};
