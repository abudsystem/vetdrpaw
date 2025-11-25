"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewLiabilityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        type: "PRESTAMO" as 'PRESTAMO' | 'OBLIGACION',
        description: "",
        amount: 0,
        startDate: new Date().toISOString().split("T")[0],
        interestRate: 0,
        termMonths: 12,
        amountPaid: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    };

    // Calculate preview values
    const totalInterest = formData.amount * (formData.interestRate / 100) * formData.termMonths;
    const totalDebt = formData.amount + totalInterest;
    const pendingAmount = Math.max(0, totalDebt - formData.amountPaid);
    const monthlyPayment = formData.termMonths > 0 ? totalDebt / formData.termMonths : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/liabilities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Error al crear el pasivo");
            }

            router.push("/administrador/pasivos");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Registrar Nuevo Pasivo</h1>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Pasivo
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="PRESTAMO">Préstamo</option>
                                <option value="OBLIGACION">Obligación</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.type === 'PRESTAMO'
                                    ? 'Deuda con entidad financiera o terceros'
                                    : 'Pago mensual recurrente (arriendo, servicios, etc.)'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Inicio
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Ej: Préstamo bancario para equipamiento médico"
                            />
                        </div>

                        <div>
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
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
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
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Dejar en 0 si no genera intereses
                            </p>
                        </div>

                        <div>
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
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
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
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Opcional: si ya se han realizado pagos
                            </p>
                        </div>
                    </div>

                    {/* Preview Section */}
                    {formData.amount > 0 && (
                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Vista Previa de Cálculos</h3>
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
                            <p className="text-xs text-gray-500 mt-3">
                                * Estos cálculos son estimados basados en interés simple mensual
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar Pasivo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
