"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewCashFlowPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        type: "INGRESO" as 'INGRESO' | 'EGRESO',
        category: "SERVICIO" as any, // Changed from VENTA - now auto-created
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        createdBy: "Administrador", // In production use actual user
    });

    const ingresoCategories = ['SERVICIO', 'OTRO']; // VENTA removed - auto-created from sales
    const egresoCategories = ['GASTO', 'PAGO_PASIVO', 'COMPRA_INVENTARIO', 'OTRO'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // When changing type, reset category to first option of that type
        if (name === 'type') {
            const newCategory = value === 'INGRESO' ? 'SERVICIO' : 'GASTO'; // Changed from VENTA
            setFormData(prev => ({
                ...prev,
                [name]: value as 'INGRESO' | 'EGRESO',
                category: newCategory
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "number" ? Number(value) : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/cashflow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Error al registrar la transacción");
            }

            router.push("/administrador/flujodecaja");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const categories = formData.type === 'INGRESO' ? ingresoCategories : egresoCategories;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Registrar Transacción</h1>
                <Link
                    href="/administrador/flujodecaja"
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

                {/* Info banner about automatic integration */}
                <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>💡 Integración Automática:</strong> Las ventas se registran automáticamente en el flujo de caja.
                                Solo necesitas registrar manualmente <strong>servicios, gastos y otros ingresos/egresos</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Transacción
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${formData.type === 'INGRESO'
                                    ? 'text-green-700 focus:ring-green-500'
                                    : 'text-red-700 focus:ring-blue-500'
                                    }`}
                            >
                                <option value="INGRESO">↑ Ingreso</option>
                                <option value="EGRESO">↓ Egreso</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoría
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-700 mt-1">
                                {formData.type === 'INGRESO'
                                    ? 'Fuente del ingreso'
                                    : 'Destino del gasto'}
                            </p>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monto ($)
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
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full text-gray-700 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Pago de arriendo mensual, Venta de producto X, etc."
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    {formData.amount > 0 && (
                        <div className={`p-4 rounded-lg border-2 ${formData.type === 'INGRESO'
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                            }`}>
                            <h3 className="font-semibold text-gray-800 mb-2">Vista Previa</h3>
                            <div className="text-sm text-gray-700">
                                <p>
                                    Se registrará un <strong>{formData.type}</strong> por{' '}
                                    <span className={`text-lg font-bold ${formData.type === 'INGRESO' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {formData.type === 'INGRESO' ? '+' : '-'}${formData.amount.toLocaleString()}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-700 mt-1">
                                    Categoría: {formData.category} | Fecha: {new Date(formData.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-md text-white transition-colors disabled:opacity-50 ${formData.type === 'INGRESO'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {loading ? "Guardando..." : "Registrar Transacción"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
