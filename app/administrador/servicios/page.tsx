"use client";

import { useServices } from "@/hooks/useServices";
import { ServiceList } from "@/components/administrador/servicios/ServiceList";
import { ServiceHeader } from "@/components/administrador/servicios/ServiceHeader";
import { ServiceFilters } from "@/components/administrador/servicios/ServiceFilters";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ADMINServicesPage() {

    const t = useTranslations('AdminDashboard.services');
    const {
        services,
        loading,
        showActiveOnly,
        setShowActiveOnly,
        toggleServiceStatus
    } = useServices();

    const [searchTerm, setSearchTerm] = useState("");

    const filteredServices = services.filter(
        (service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <ServiceHeader />

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                </div>
            </div>


            <ServiceFilters showActiveOnly={showActiveOnly} setShowActiveOnly={setShowActiveOnly} />

            {loading ? (
                <p>Cargando servicios...</p>
            ) : (
                <ServiceList services={filteredServices} onToggleStatus={toggleServiceStatus} />
            )}
        </div>
    );
}
