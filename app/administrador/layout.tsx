import Sidebar from "@/components/layout/Sidebar";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useTranslations } from "next-intl";

export default function administradorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations("Sidebar.admin");

    const adminLinks = [
        { href: "/administrador/dashboard", label: t("dashboard") },
        { href: "/administrador/usuarios", label: t("users") },
        { href: "/administrador/roles", label: t("roles") },
        { href: "/administrador/inventario", label: t("inventory") },
        { href: "/administrador/servicios", label: t("services") },
        { href: "/administrador/activos", label: t("assets") },
        { href: "/administrador/pasivos", label: t("liabilities") },
        { href: "/administrador/balance", label: t("balance") },
        { href: "/administrador/flujodecaja", label: t("cashFlow") },
        { href: "/administrador/copiainventario", label: t("inventoryBackup") },
        { href: "/administrador/negocio", label: t("business") },
        { href: "/administrador/pet-care", label: t("petCare") },
        { href: "/administrador/calendario", label: t("calendar") },
        { href: "/administrador/galeria", label: t("gallery") },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row print:bg-white print:block">
            <Sidebar
                title={t("title")}
                links={adminLinks}
                bgColor="bg-gray-900"
                hoverColor="hover:bg-gray-800"
                borderColor="border-gray-800"
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
