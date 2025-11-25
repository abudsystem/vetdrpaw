import Sidebar from "@/components/layout/Sidebar";

const vetLinks = [
    { href: "/veterinario/dashboard", label: "Dashboard" },
    { href: "/veterinario/mascotas", label: "Pacientes y Clientes" },
    { href: "/veterinario/citas", label: "Gestión de Citas" },
    { href: "/veterinario/perfil", label: "Mi Perfil" },
    { href: "/veterinario/servicios", label: "Servicios Veterinarios" },
    { href: "/veterinario/ventas", label: "Ventas" },
];

export default function VetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <Sidebar
                title="Panel Veterinario"
                links={vetLinks}
                bgColor="bg-indigo-900"
                hoverColor="hover:bg-indigo-800"
                borderColor="border-indigo-800"
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
