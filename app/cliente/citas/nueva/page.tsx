"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Pet {
    _id: string;
    nombre: string;
    especie: string;
}

export default function NewAppointmentPage() {
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        pet: "",
        date: "",
        time: "",
        reason: "",
    });

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const res = await fetch("/api/pets?my_pets=true");
            if (res.ok) {
                const data = await res.json();
                setPets(data);
            }
        } catch (error) {
            console.error("Error fetching pets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Combinar fecha y hora
            const dateTime = new Date(`${formData.date}T${formData.time}`);

            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pet: formData.pet,
                    date: dateTime.toISOString(),
                    reason: formData.reason,
                }),
            });

            if (res.ok) {
                alert("Cita solicitada exitosamente. Espera la confirmación del veterinario.");
                router.push("/cliente/citas");
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || "No se pudo crear la cita"}`);
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Error al solicitar la cita");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">Cargando...</div>;

    if (pets.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            ⚠️
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Necesitas registrar al menos una mascota antes de solicitar una cita.
                            </p>
                            <button
                                onClick={() => router.push("/cliente/mascotas")}
                                className="mt-3 text-sm font-medium text-yellow-700 underline hover:text-yellow-600"
                            >
                                Ir a Mis Mascotas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Solicitar Nueva Cita</h1>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-700">
                    💡 Tu cita quedará como <strong>pendiente</strong> hasta que un veterinario la acepte.
                    Recibirás una notificación cuando sea confirmada.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Seleccionar Mascota */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mascota <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.pet}
                            onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="">Selecciona una mascota</option>
                            {pets.map((pet) => (
                                <option key={pet._id} value={pet._id}>
                                    {pet.nombre} ({pet.especie})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Hora */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hora <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Horario sugerido: 8:00 AM - 6:00 PM
                        </p>
                    </div>

                    {/* Motivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo de la consulta <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Describe brevemente el motivo de la consulta..."
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
                            {submitting ? "Solicitando..." : "Solicitar Cita"}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/cliente/citas")}
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
