import Sidebar from "@/components/layout/Sidebar";

const adminLinks = [
    { href: "/administrador/dashboard", label: "Dashboard" },
    { href: "/administrador/usuarios", label: "Gestión de Usuarios" },
    { href: "/administrador/roles", label: "Gestión de Roles" },
    { href: "/administrador/inventario", label: "Inventario" },
    { href: "/administrador/servicios", label: "Servicios Veterinarios" },
    { href: "/administrador/activos", label: "Activos" },
    { href: "/administrador/pasivos", label: "Pasivos" },
    { href: "/administrador/balance", label: "Balance General" },
    { href: "/administrador/flujodecaja", label: "Flujo de Caja" },
    { href: "/administrador/copiainventario", label: "Copias de Inventario" },
    { href: "/administrador/negocio", label: "📊 Negocio" },
];

export default function administradorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <Sidebar
                title="Administrador Panel"
                links={adminLinks}
                bgColor="bg-gray-900"
                hoverColor="hover:bg-gray-800"
                borderColor="border-gray-800"
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
