import Link from 'next/link';

export interface ISale {
    _id: string;
    total: number;
    paymentMethod: string;
    date: string;
    client?: { name: string };
    pet?: { nombre: string; especie: string };
    appointment?: { reason: string; date: string };
    user: { name: string };
    products: any[];
}

interface SalesMobileCardProps {
    sale: ISale;
}

const truncate = (text: string, limit: number = 20) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
};

export const SalesMobileCard = ({ sale }: SalesMobileCardProps) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {sale.client?.name || "Cliente General"}
                    </h3>
                    <p className="text-xs text-gray-700 mt-1">
                        {new Date(sale.date).toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${sale.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-700">Total</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {sale.pet && (
                    <div className="flex flex-col col-span-2 mb-2 border-b border-gray-200 pb-2" title={`${sale.pet.nombre} (${sale.pet.especie})`}>
                        <span className="text-xs text-gray-700">Paciente</span>
                        <span className="font-medium text-indigo-700">{truncate(`${sale.pet.nombre} (${sale.pet.especie})`)}</span>
                    </div>
                )}
                {sale.appointment && (
                    <div className="flex flex-col col-span-2 mb-2 border-b border-gray-200 pb-2" title={sale.appointment.reason}>
                        <span className="text-xs text-gray-700">Cita Vinculada</span>
                        <span className="font-medium text-emerald-700">{truncate(sale.appointment.reason)}</span>
                    </div>
                )}
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">Método Pago</span>
                    <span className="font-medium">{sale.paymentMethod}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-700">Registrado Por</span>
                    <span className="font-medium">{sale.user?.name || "N/A"}</span>
                </div>
            </div>

            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                <Link
                    href={`/veterinario/ventas/detalle/${sale._id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-blue-600 bg-white hover:bg-gray-50 focus:outline-none"
                >
                    Ver Factura
                </Link>
            </div>
        </div>
    );
};
