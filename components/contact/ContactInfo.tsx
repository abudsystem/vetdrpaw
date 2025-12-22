import { MapPin, Phone, Instagram, Facebook } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

export const ContactInfo = () => {
    const t = useTranslations("Contact");

    return (
        <div className="bg-gray-100 p-6 sm:p-8 flex flex-col items-center justify-start space-y-6">

            {/* MAPA MÁS PEQUEÑO */}
            <div className="w-full flex justify-center">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!4v1764086290294!6m8!1m7!1sxlmExxQi-UvCulORRqd1tA!2m2!1d-0.08449035659170309!2d-78.43360805276531!3f49.6542280937762!4f18.403214162726655!5f0.7820865974627469"
                    width="100%"
                    height="250"
                    style={{ border: "0", borderRadius: "10px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* INFO */}
            <div className="text-gray-700 text-sm space-y-4">

                {/* Dirección */}
                <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    <a
                        href="https://www.google.com/maps?sca_esv=2286ae5c4aad172f&hl=es-419&authuser=0&kgs=d684a9a79c5868da&daddr=WH88%2B4J9,+Av.+Cacha,+Quito+170155"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 font-semibold hover:underline"
                    >
                        {t("address")}
                    </a>
                </div>

                {/* Teléfono */}
                <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5 text-teal-600" />
                    <span>0995398645</span>
                </div>


                {/* Redes */}
                <div className="flex flex-col items-center space-y-2 mt-3">
                    <div className="flex items-center space-x-2">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <a
                            href="https://www.instagram.com/vet_drpaw?utm_source=qr&igsh=dzA1NXdmN2lqYmE5"
                            target="_blank"
                            className="font-semibold text-teal-700 hover:underline"
                        >
                            Vet_DrPaw
                        </a>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <a
                            href="https://www.facebook.com/DrPawEc"
                            target="_blank"
                            className="font-semibold text-teal-700 hover:underline"
                        >
                            DrPaw_Ecu
                        </a>
                    </div>
                </div>

                {/* Horarios */}
                <div className="mt-4 text-center">
                    <p className="font-semibold text-gray-900">{t("hoursTitle")}</p>
                    <p>{t("regularHours")}</p>
                    <p>{t("regularHoursDetail")}</p>
                    <p>{t("emergencyHours")}</p>
                    <p>{t("emergencyHoursDetail")}</p>
                </div>

            </div>

        </div>
    );
};
