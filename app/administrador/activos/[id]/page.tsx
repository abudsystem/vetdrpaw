"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const { id } = use(params);

    const [formData, setFormData] = useState({
        name: "",
        category: "Equipamiento",
        quantity: 1,
        unitCost: 0,
        acquisitionDate: "",
        isDepreciable: false,
        usefulLifeMonths: 0,
    });

    const categories = [
        "Equipamiento",
        "Mobiliario",
        "Insumos",
        "Adecuaciones",
        "Tecnología",
        "Vehículos",
        "Otros"
    ];

    useEffect(() => {
        fetchAsset();
    }, [id]);

    const fetchAsset = async () => {
        try {
            const res = await fetch(`/api/assets?search=&id=${id}`); // Assuming list endpoint can filter by ID or we just fetch all and find? 
            // Actually, the list endpoint doesn't support ID filtering in my implementation.
            // I should have implemented a GET /api/assets/[id] endpoint?
            // Wait, I implemented /api/assets/[id]/route.ts but it only has PUT and DELETE.
            // I need to add GET to /api/assets/[id]/route.ts or filter in the list.
            // Let's check my implementation of /api/assets/[id]/route.ts.
            // It imports AssetController.update and delete.
            // I need to add a 'get' method to AssetController and export it as GET in [id]/route.ts.

            // For now, I'll fix the controller and route first? 
            // Or I can just fetch the list and find it on the client side if the list is small?
            // No, that's bad practice.

            // I will assume I will fix the backend to support GET /api/assets/[id].
            // Let's write the frontend code assuming it works, then I'll go fix the backend.

            const response = await fetch(`/api/assets/${id}`);
            if (!response.ok) throw new Error("Error al cargar el activo");

            const data = await response.json();
            setFormData({
                name: data.name,
                category: data.category,
                quantity: data.quantity,
                unitCost: data.unitCost,
                acquisitionDate: new Date(data.acquisitionDate).toISOString().split("T")[0],
                isDepreciable: data.isDepreciable,
                usefulLifeMonths: data.usefulLifeMonths || 0,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "number" ? Number(value) : value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`/api/assets/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Error al actualizar el activo");
            }

            router.push("/administrador/activos");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Editar Activo</h1>
                <Link
                    href="/administrador/activos"
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
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del Activo
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoría
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de Adquisición
                            </label>
                            <input
                                type="date"
                                name="acquisitionDate"
                                value={formData.acquisitionDate}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Costo Unitario ($)
                            </label>
                            <input
                                type="number"
                                name="unitCost"
                                value={formData.unitCost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="isDepreciable"
                                name="isDepreciable"
                                checked={formData.isDepreciable}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isDepreciable" className="ml-2 block text-sm text-gray-900 font-medium">
                                ¿Es un activo depreciable?
                            </label>
                        </div>

                        {formData.isDepreciable && (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vida Útil (Meses)
                                </label>
                                <input
                                    type="number"
                                    name="usefulLifeMonths"
                                    value={formData.usefulLifeMonths}
                                    onChange={handleChange}
                                    min="1"
                                    required={formData.isDepreciable}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? "Guardando..." : "Actualizar Activo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
