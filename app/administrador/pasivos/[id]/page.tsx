"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditLiabilityPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const { id } = use(params);

    const [formData, setFormData] = useState({
        type: "PRESTAMO" as 'PRESTAMO' | 'OBLIGACION',
        description: "",
        amount: 0,
        startDate: "",
        interestRate: 0,
        termMonths: 12,
        amountPaid: 0,
    });

    useEffect(() => {
        fetchLiability();
    }, [id]);

    const fetchLiability = async () => {
        try {
            const response = await fetch(`/api/liabilities/${id}`);
            if (!response.ok) throw new Error("Error al cargar el pasivo");

            const data = await response.json();
            setFormData({
                type: data.type,
                description: data.description,
                amount: data.amount,
                startDate: new Date(data.startDate).toISOString().split("T")[0],
                interestRate: data.interestRate,
                termMonths: data.termMonths,
                amountPaid: data.amountPaid,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    };

    // Calculate values
    const totalInterest = formData.amount * (formData.interestRate / 100) * formData.termMonths;
    const totalDebt = formData.amount + totalInterest;
    const pendingAmount = Math.max(0, totalDebt - formData.amountPaid);
    const monthlyPayment = formData.termMonths > 0 ? totalDebt / formData.termMonths : 0;
    const paymentProgress = totalDebt > 0 ? (formData.amountPaid / totalDebt) * 100 : 0;
    const monthsElapsed = formData.amountPaid > 0 ? Math.floor(formData.amountPaid / monthlyPayment) : 0;
    const monthsRemaining = Math.max(0, formData.termMonths - monthsElapsed);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/liabilities/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...formData }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Error al actualizar el pasivo");
            }

            router.push("/administrador/pasivos");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Editar Pasivo</h1>
                <Link
                    href="/administrador/pasivos"
                    className="text-gray-600 hover:text-gray-900"
                >
                    Cancelar
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Progress Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Progreso de Pago</h3>
                        <div className="space-y-4">
                            <div className="col-span-2">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">Pagado</span>
                                    <span className="font-semibold text-gray-900">
                                        {paymentProgress.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${paymentProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-700">Deuda Total</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ${totalDebt.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-700">Pendiente</p>
                                    <p className="text-lg font-bold text-red-600">
                                        ${pendingAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-700">Meses Restantes</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        {monthsRemaining}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Pasivo
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="PRESTAMO">Préstamo</option>
                                <option value="OBLIGACION">Obligación</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monto Principal ($)
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tasa de Interés Mensual (%)
                            </label>
                            <input
                                type="number"
                                name="interestRate"
                                value={formData.interestRate}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Plazo (Meses)
                            </label>
                            <input
                                type="number"
                                name="termMonths"
                                value={formData.termMonths}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monto Ya Pagado ($)
                            </label>
                            <input
                                type="number"
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-700 mt-1">
                                💡 Actualice este campo cuando realice un pago
                            </p>
                        </div>
                    </div>

                    {/* Calculations Summary */}
                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Resumen de Cálculos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Interés Total</p>
                                <p className="text-xl font-bold text-blue-700">
                                    ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Deuda Total</p>
                                <p className="text-xl font-bold text-red-700">
                                    ${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Pago Mensual</p>
                                <p className="text-xl font-bold text-purple-700">
                                    ${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">Monto Pendiente</p>
                                <p className="text-xl font-bold text-orange-700">
                                    ${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? "Guardando..." : "Actualizar Pasivo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
