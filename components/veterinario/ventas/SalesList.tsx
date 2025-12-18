import Link from 'next/link';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { SalesMobileCard, ISale } from './SalesMobileCard';
export type { ISale };
import { Pagination } from '@/components/ui/Pagination';
import { usePagination } from '@/hooks/usePagination';

interface SalesListProps {
    sales: ISale[];
}

const truncate = (text: string, limit: number = 20) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
};

export const SalesList = ({ sales }: SalesListProps) => {
    const {
        paginatedItems: paginatedSales,
        currentPage,
        totalPages,
        totalItems,
        handlePageChange
    } = usePagination(sales, 10);

    if (sales.length === 0) {
        return (
            <div className="p-6 text-center text-gray-700 bg-white rounded-lg shadow">
                No hay ventas registradas.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {paginatedSales.map((sale) => (
                    <SalesMobileCard key={sale._id} sale={sale} />
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Fecha</th>
                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Cliente</th>
                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Total</th>
                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Método Pago</th>
                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Registrado Por</th>

                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Paciente</th>
                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Cita</th>
                            <th className="py-3 px-4 border-b font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSales.map((sale) => (
                            <tr key={sale._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b text-gray-800">
                                    {new Date(sale.date).toLocaleString()}
                                </td>
                                <td className="py-3 px-4 border-b text-gray-800">
                                    {sale.client?.name || "Cliente General"}
                                </td>
                                <td className="py-3 px-4 border-b text-gray-800 font-bold">
                                    ${sale.total.toFixed(2)}
                                </td>
                                <td className="py-3 px-4 border-b text-gray-800">
                                    {sale.paymentMethod}
                                </td>
                                <td className="py-3 px-4 border-b text-gray-800">
                                    {sale.user?.name || "N/A"}
                                </td>

                                <td className="py-3 px-4 border-b text-gray-800" title={sale.pet ? `${sale.pet.nombre} (${sale.pet.especie})` : ""}>
                                    {sale.pet ? truncate(`${sale.pet.nombre} (${sale.pet.especie})`) : "-"}
                                </td>
                                <td className="py-3 px-4 border-b text-gray-800" title={sale.appointment?.reason || ""}>
                                    {sale.appointment ? truncate(sale.appointment.reason) : "-"}
                                </td><td className="py-3 px-4 border-b">
                                    <Link
                                        href={`/veterinario/ventas/detalle/${sale._id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Ver Factura
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
