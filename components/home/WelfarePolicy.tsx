import { useTranslations } from "next-intl";

export default function WelfarePolicy() {
    const t = useTranslations("WelfarePolicy");

    return (
        <div className="bg-teal-900 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    {t("title")}
                </h2>
                <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                    {t("description")}
                </p>
            </div>
        </div>
    );
}
