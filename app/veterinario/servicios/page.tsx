"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/service";
import { ServiceList } from "@/components/veterinario/servicios/ServiceList";
import { ServiceHeader } from "@/components/veterinario/servicios/ServiceHeader";
import { ServiceFilters } from "@/components/veterinario/servicios/ServiceFilters";
import { Search } from "lucide-react";

export default function VeterinarioServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchServices = async () => {
        setLoading(true);
        try {
            const query = showActiveOnly ? "?activeOnly=true" : "";
            const res = await fetch(`/api/services${query}`);
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [showActiveOnly]);

    const handleToggleStatus = async (id: string) => {
        if (!confirm("¿Estás seguro de cambiar el estado de este servicio?")) return;

        try {
            const res = await fetch(`/api/services/${id}`, {
                method: "PATCH",
            });
            if (res.ok) {
                fetchServices();
            } else {
                alert("Error al cambiar el estado");
            }
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

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
                        placeholder="Buscar por nombre o descripción..."
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            <ServiceFilters showActiveOnly={showActiveOnly} setShowActiveOnly={setShowActiveOnly} />

            {loading ? (
                <p>Cargando servicios...</p>
            ) : (
                <ServiceList services={filteredServices} onToggleStatus={handleToggleStatus} />
            )}
        </div>
    );
}
