import Sidebar from "@/components/layout/Sidebar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

export default function VetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations("Sidebar.vet");

    const vetLinks = [
        { href: "/veterinario/dashboard", label: t("dashboard") },
        { href: "/veterinario/mascotas", label: t("pets") },
        { href: "/veterinario/citas", label: t("appointments") },
        { href: "/veterinario/perfil", label: t("profile") },
        { href: "/veterinario/servicios", label: t("services") },
        { href: "/veterinario/ventas", label: t("sales") },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row print:bg-white print:block">
            <Sidebar
                title={t("title")}
                links={vetLinks}
                bgColor="bg-indigo-900"
                hoverColor="hover:bg-indigo-800"
                borderColor="border-indigo-800"
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto print:p-0 print:m-0">
                <ScrollReveal>
                    {children}
                </ScrollReveal>
            </main>
        </div>
    );
}
