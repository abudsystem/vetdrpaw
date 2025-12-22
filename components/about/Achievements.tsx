import React from "react";
import { useTranslations } from "next-intl";

export const Achievements = () => {
    const t = useTranslations("About");

    return (
        <div className="bg-teal-50 py-16 rounded-xl mb-24 shadow-inner">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
                {t("achievementsTitle")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">

                <div>
                    <p className="text-4xl font-extrabold text-teal-700">+5</p>
                    <p className="text-gray-600 mt-2">{t("yearsExp")}</p>
                </div>

                <div>
                    <p className="text-4xl font-extrabold text-teal-700">+1200</p>
                    <p className="text-gray-600 mt-2">{t("petsServed")}</p>
                </div>

                <div>
                    <p className="text-4xl font-extrabold text-teal-700">UTA</p>
                    <p className="text-gray-600 mt-2">{t("profTraining")}</p>
                </div>

            </div>
        </div>
    );
};
