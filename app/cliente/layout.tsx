import Sidebar from "@/components/layout/Sidebar";

const clientLinks = [
    { href: "/cliente/dashboard", label: "🏠 Dashboard" },
    { href: "/cliente/mascotas", label: "🐾 Mis Mascotas" },
    { href: "/cliente/citas", label: "📅 Mis Citas" },
    { href: "/cliente/perfil", label: "👤 Mi Perfil" },
];

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <Sidebar
                title="Mi Panel"
                links={clientLinks}
                bgColor="bg-teal-800"
                hoverColor="hover:bg-teal-700"
                borderColor="border-teal-700"
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
