"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SaleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const [sale, setSale] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchSale();
    }, [id]);

    const fetchSale = async () => {
        try {
            const res = await fetch(`/api/sales/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSale(data);
            } else {
                alert("Venta no encontrada");
                router.push("/veterinario/ventas");
            }
        } catch (error) {
            console.error("Error fetching sale:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <p className="p-8">Cargando factura...</p>;
    if (!sale) return null;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg my-8 print:shadow-none print:w-full print:max-w-none print:my-0 print:rounded-none">
            {/* Header */}
            <div className="text-center border-b pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Veterinaria DrPaw</h1>
                <p className="text-gray-600">Clínica Veterinaria</p>
                <p className="text-sm text-gray-700 mt-2">Comprobante de Venta</p>
                <p className="text-sm text-gray-700">#{sale._id.slice(-6).toUpperCase()}</p>
            </div>

            {/* Info */}
            <div className="flex justify-between mb-6 text-sm text-gray-700">
                <div>
                    <p><span className="font-bold">Fecha:</span> {new Date(sale.date).toLocaleString()}</p>
                    <p><span className="font-bold">Atendido por:</span> {sale.user?.name}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Cliente:</span> {sale.client?.name || "Público General"}</p>
                    {/* {sale.pet && (
                        <p><span className="font-bold">Paciente:</span> {sale.pet.nombre} ({sale.pet.especie})</p>
                    )} */}
                    {/* {sale.appointment && (
                        <p><span className="font-bold">Cita:</span> {sale.appointment.reason}</p>
                    )} */}
                    <p><span className="font-bold">Método Pago:</span> {sale.paymentMethod}</p>
                </div>
            </div>

            {/* Items */}
            <table className="w-full mb-6">
                <thead>
                    <tr className="border-b-2 border-gray-200 text-left text-gray-600 text-sm">
                        <th className="py-2">Producto</th>
                        <th className="py-2 text-center">Cant.</th>
                        <th className="py-2 text-right">Precio</th>
                        <th className="py-2 text-right">Sub</th>
                    </tr>
                </thead>
                <tbody className="text-gray-800 text-sm">
                    {sale.products.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                            <td className="py-2">{item.name}</td>
                            <td className="py-2 text-center">{item.quantity}</td>
                            <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                            <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                    {sale.services && sale.services.map((item: any, index: number) => (
                        <tr key={`svc-${index}`} className="border-b border-gray-100 italic">
                            <td className="py-2">{item.name} 🩺</td>
                            <td className="py-2 text-center">{item.quantity}</td>
                            <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                            <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end border-t pt-4">
                <div className="text-right space-y-1">
                    <p className="text-sm text-gray-600">Subtotal: ${(sale.subtotal || (sale.total / 1.15)).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">IVA (15%): ${(sale.iva || (sale.total - (sale.total / 1.15))).toFixed(2)}</p>
                    <p className="text-2xl font-bold text-gray-900 pt-2 border-t">Total: ${sale.total.toFixed(2)}</p>
                </div>
            </div>

            {/* Footer / Actions */}
            <div className="mt-8 flex justify-center gap-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Imprimir
                </button>
                <button
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}
