import Link from 'next/link';

interface Service {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    duration: number;
    isActive: boolean;
    supplies?: any[];
}

interface ServiceMobileCardProps {
    service: Service;
    onToggleStatus: (id: string) => void;
}

export const ServiceMobileCard = ({ service, onToggleStatus }: ServiceMobileCardProps) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>

                    {/* Precio en mobile: debajo del nombre */}
                    <p className="sm:hidden text-lg font-bold text-gray-900 mt-1">
                        ${service.basePrice.toFixed(2)}
                    </p>

                    <p className="text-sm text-gray-700 mt-1 truncate max-w-[200px]">
                        {service.description}
                    </p>
                </div>

                {/* Precio en desktop: a la derecha */}
                <div className="hidden sm:block text-right">
                    <p className="text-lg font-bold text-gray-900">
                        ${service.basePrice.toFixed(2)}
                    </p>
                </div>
            </div>


            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">Duración</span>
                    <span className="font-medium">{service.duration} min</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">Insumos</span>
                    <span className="font-medium">{service.supplies?.length || 0}</span>
                </div>
                <div className="flex flex-col col-span-2 mt-2 pt-2 border-t border-gray-200 items-center">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${service.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                    >
                        {service.isActive ? "Activo" : "Inactivo"}
                    </span>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                <Link
                    href={`/veterinario/servicios/editar/${service._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                    Editar
                </Link>
                <button
                    onClick={() => onToggleStatus(service._id)}
                    className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded focus:outline-none ${service.isActive
                        ? "text-red-700 bg-red-100 hover:bg-red-200"
                        : "text-green-700 bg-green-100 hover:bg-green-200"
                        }`}
                >
                    {service.isActive ? "Desactivar" : "Activar"}
                </button>
            </div>
        </div>
    );
};
