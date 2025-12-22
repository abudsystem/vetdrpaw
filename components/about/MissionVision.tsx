import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

export const MissionVision = () => {
    const t = useTranslations("About");

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start mb-24">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                    {t("missionTitle")}
                </h2>
                <p className="mt-4 text-lg text-gray-700">
                    {t("missionDescription")}
                </p>

                <h2 className="mt-10 text-3xl font-extrabold text-gray-900">
                    {t("teamTitle")}
                </h2>
                <p className="mt-4 text-lg text-gray-700">
                    {t("teamDescription")}
                </p>
            </div>

            <div className="mt-10 lg:mt-0">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
                    <Image src="/imagenveterinarionueva.jpeg" alt="Equipo" height={400} width={600} />
                </div>
            </div>
        </div>
    );
};
