"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IService {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    duration: number;
    isActive: boolean;
    supplies: any[];
}

export default function ServicesPage() {
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState(true);
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const router = useRouter();

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

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Servicios Veterinarios</h1>
                <Link
                    href="/veterinario/servicios/nuevo"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Nuevo Servicio
                </Link>
            </div>

            <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showActiveOnly}
                        onChange={(e) => setShowActiveOnly(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-700">Mostrar solo activos</span>
                </label>
            </div>

            {loading ? (
                <p>Cargando servicios...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Nombre</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Precio Base</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Duración (min)</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Insumos</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Estado</th>
                                <th className="py-3 px-4 border-b font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                                        No hay servicios registrados.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            <div className="font-medium">{service.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {service.description}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            ${service.basePrice.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            {service.duration}
                                        </td>
                                        <td className="py-3 px-4 border-b text-gray-800">
                                            {service.supplies.length}
                                        </td>
                                        <td className="py-3 px-4 border-b">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${service.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {service.isActive ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 border-b space-x-2">
                                            <Link
                                                href={`/veterinario/servicios/editar/${service._id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleToggleStatus(service._id)}
                                                className={`text-sm hover:underline ${service.isActive ? "text-red-600" : "text-green-600"
                                                    }`}
                                            >
                                                {service.isActive ? "Desactivar" : "Activar"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
