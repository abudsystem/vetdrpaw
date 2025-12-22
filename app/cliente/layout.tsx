import Sidebar from "@/components/layout/Sidebar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations("Sidebar.client");

    const clientLinks = [
        { href: "/cliente/dashboard", label: t("dashboard") },
        { href: "/cliente/mascotas", label: t("pets") },
        { href: "/cliente/citas", label: t("appointments") },
        { href: "/cliente/perfil", label: t("profile") },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <Sidebar
                title={t("title")}
                links={clientLinks}
                bgColor="bg-teal-800"
                hoverColor="hover:bg-teal-700"
                borderColor="border-teal-700"
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <ScrollReveal>
                    {children}
                </ScrollReveal>
            </main>
        </div>
    );
}
