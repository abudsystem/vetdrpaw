import React from "react";
import { useTranslations } from "next-intl";

export const History = () => {
    const t = useTranslations("About");

    return (
        <div className="mb-24">
            <h2 className="text-3xl font-extrabold text-gray-900">{t("headerTitle")}</h2>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl">
                {t("historyDesc")}
            </p>
        </div>
    );
};
