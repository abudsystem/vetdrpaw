"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        telefono: "",
        direccion: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/users/me");
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    telefono: data.telefono || "",
                    direccion: data.direccion || "",
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/users/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Perfil actualizado exitosamente");
                router.push("/cliente/perfil");
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || "No se pudo actualizar el perfil"}`);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error al actualizar el perfil");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Perfil</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correo electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            placeholder="Ej: +57 300 123 4567"
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dirección
                        </label>
                        <textarea
                            rows={3}
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            placeholder="Ej: Calle 123 #45-67, Bogotá"
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-400"
                        >
                            {submitting ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/cliente/perfil")}
                            className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
