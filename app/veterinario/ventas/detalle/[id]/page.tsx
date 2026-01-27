"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SaleDetailPage() {
    const t = useTranslations('VetPanel.sales.bill');
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
                alert(t('alert'));
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

    if (loading) return <p className="p-8">{t('loading')}</p>;
    if (!sale) return null;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg my-8 print:shadow-none print:w-full print:max-w-none print:my-0 print:rounded-none">
            {/* Header */}
            <div className="text-center border-b pb-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
                <p className="text-gray-600">{t('subtitle')}</p>
                <p className="text-sm text-gray-700 mt-2">{t('purchase')}</p>
                <div className="mt-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t('invoiceInternal') || "Venta #"}</p>
                    <p className="text-sm font-mono font-bold text-gray-800">#{sale._id.slice(-8).toUpperCase()}</p>
                </div>
                {sale.invoiceNumber && (
                    <div className="mt-2 py-1 px-3 bg-white inline-block rounded-md border border-blue-100">
                        <p className="text-[10px] text-black uppercase font-bold tracking-tighter leading-none mb-1">
                            {t('invoiceManual') || "Factura/Nota #"}
                        </p>
                        <p className="text-lg font-black text-black leading-none">
                            {sale.invoiceNumber}
                        </p>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex justify-between mb-6 text-sm text-gray-700">
                <div>
                    <p><span className="font-bold">{t('date')}:</span> {new Date(sale.date).toLocaleString()}</p>
                    <p><span className="font-bold">{t('attendant')}:</span> {sale.user?.name}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">{t('client')}:</span> {sale.client?.name || t('generalClient')}</p>
                    {/* {sale.pet && (
                        <p><span className="font-bold">Paciente:</span> {sale.pet.nombre} ({sale.pet.especie})</p>
                    )} */}
                    {/* {sale.appointment && (
                        <p><span className="font-bold">Cita:</span> {sale.appointment.reason}</p>
                    )} */}
                    <p><span className="font-bold">{t('paymentMethod')}:</span> {sale.paymentMethod}</p>
                </div>
            </div>

            {/* Items */}
            <table className="w-full mb-6">
                <thead>
                    <tr className="border-b-2 border-gray-200 text-left text-gray-600 text-sm">
                        <th className="py-2">{t('product')}</th>
                        <th className="py-2 text-center">{t('quantity')}</th>
                        <th className="py-2 text-right">{t('price')}</th>
                        <th className="py-2 text-right">{t('subtotal')}</th>
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
                    {t('printInvoice')}
                </button>
                <button
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                    {t('returnInvoice')}
                </button>
            </div>
        </div>
    );
}
