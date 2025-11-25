"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<string[]>([]);

    const validatePassword = (): boolean => {
        const newErrors: string[] = [];

        if (formData.currentPassword.length < 1) {
            newErrors.push("Debes ingresar tu contraseña actual");
        }

        if (formData.newPassword.length < 6) {
            newErrors.push("La nueva contraseña debe tener al menos 6 caracteres");
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.push("Las contraseñas nuevas no coinciden");
        }

        if (formData.currentPassword === formData.newPassword) {
            newErrors.push("La nueva contraseña debe ser diferente a la actual");
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword()) return;

        setSubmitting(true);
        setErrors([]);

        try {
            const res = await fetch("/api/users/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (res.ok) {
                alert("Contraseña cambiada exitosamente");
                router.push("/cliente/perfil");
            } else {
                const error = await res.json();
                setErrors([error.message || "No se pudo cambiar la contraseña"]);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            setErrors(["Error al cambiar la contraseña"]);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h1>

            {errors.length > 0 && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            ⚠️
                        </div>
                        <div className="ml-3">
                            <ul className="list-disc list-inside text-sm text-red-700">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña actual <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">Mínimo 6 caracteres</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar nueva contraseña <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                            {submitting ? "Cambiando..." : "Cambiar Contraseña"}
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
