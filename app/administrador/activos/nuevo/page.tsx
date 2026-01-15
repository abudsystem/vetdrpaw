"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NewAssetPage() {
    const t = useTranslations("assets");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        category: "Equipamiento",
        quantity: 1,
        unitCost: 0,
        acquisitionDate: new Date().toISOString().split("T")[0],
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
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Error al crear el activo");
            }

            router.push("/administrador/activos");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
                <Link
                    href="/administrador/activos"
                    className="text-gray-600 hover:text-gray-900"
                >
                    {t("cancel")}
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
                                {t("name")}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full text-gray-700 tepx-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t("placeHolderName")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("category")}
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full  text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("dateAcquisition")}
                            </label>
                            <input
                                type="date"
                                name="acquisitionDate"
                                value={formData.acquisitionDate}
                                onChange={handleChange}
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("amount")}
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t("unitCost")} ($)
                            </label>
                            <input
                                type="number"
                                name="unitCost"
                                value={formData.unitCost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                {t("isDepreciated")}
                            </label>
                        </div>

                        {formData.isDepreciable && (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("lifeTime")}
                                </label>
                                <input
                                    type="number"
                                    name="usefulLifeMonths"
                                    value={formData.usefulLifeMonths}
                                    onChange={handleChange}
                                    min="1"
                                    required={formData.isDepreciable}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    placeholder="Ej: 60 (5 años)"
                                />
                                <p className="text-xs text-gray-700 mt-1">
                                    {t("descriptionDepreciated")}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? t("saving") : t("saved")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
