import React from "react";
import { useTranslations } from "next-intl";

export const WhyChooseUs = () => {
    const t = useTranslations("About");

    return (
        <div className="mb-24 ">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
                {t("whyTitle")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                <div className="text-center">
                    <div className="text-black-700 text-5xl mb-4">🐾</div>
                    <h3 className="text-xl text-black font-bold">{t("customCare")}</h3>
                    <p className="text-gray-700 mt-2">
                        {t("customCareDesc")}
                    </p>
                </div>

                <div className="text-center">
                    <div className="text-teal-700 text-5xl mb-4">💉</div>
                    <h3 className="text-xl text-black font-bold">{t("trainedProf")}</h3>
                    <p className="text-gray-700 mt-2">
                        {t("trainedProfDesc")}
                    </p>
                </div>

                <div className="text-center">
                    <div className="text-teal-700 text-5xl mb-4">❤️</div>
                    <h3 className="text-xl text-black font-bold">{t("passion")}</h3>
                    <p className="text-gray-700 mt-2">
                        {t("passionDesc")}
                    </p>
                </div>
            </div>
        </div>
    );
};
