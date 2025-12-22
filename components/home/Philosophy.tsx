import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Philosophy() {
    const t = useTranslations("Philosophy");

    return (
        <div className="bg-teal-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            {t("title")}
                        </h2>
                        <p className="mt-3 max-w-3xl text-lg text-gray-700">
                            {t("description")}
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                                        ✓
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg leading-6 font-medium text-gray-900">{t("preventiveTitle")}</h4>
                                    <p className="mt-2 text-base text-gray-700">{t("preventiveText")}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                                        ✓
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-lg leading-6 font-medium text-gray-900">{t("techTitle")}</h4>
                                    <p className="mt-2 text-base text-gray-700">{t("techText")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0">
                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl bg-gray-200 flex items-center justify-center">

                            <Image
                                src="/image.png"
                                alt="Philosophy"
                                width={300}
                                height={300}
                                className="w-full h-full object-cover bg-teal-50"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
