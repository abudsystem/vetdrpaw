import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
    const t = useTranslations("Footer");

    const footerLinks = [
        { label: t('home'), href: "/" },
        { label: t('about'), href: "/sobre" },
        { label: t('services'), href: "/servicios" },
        { label: t('contact'), href: "/contacto" },
        { label: t('petCare'), href: "/cuidado-mascota" },
        { label: t('login'), href: "/login" },
        { label: t('register'), href: "/register" },
    ];

    return (
        <footer className="bg-teal-950 text-white print:hidden w-full">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold text-teal-400 mb-4">
                            Veterinaria DrPaw
                        </h3>
                        <p className="text-white text-sm">{t("description")}</p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            {t("quickLinks")}
                        </h3>
                        <ul className="space-y-2 text-white text-sm">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="hover:text-teal-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            {t("contactTitle")}
                        </h3>
                        <ul className="space-y-2 text-white text-sm">
                            <li>📍 {t("address")}</li>
                            <li>📞 (+593) 099 539 8645</li>
                            <li>{t("hours")}</li>
                            <li>{t("emergency")}</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-800 pt-8 text-center text-white text-sm">
                    &copy; {new Date().getFullYear()} Veterinaria DrPaw. {t("rights")}
                </div>
            </div>
        </footer>
    );
}
