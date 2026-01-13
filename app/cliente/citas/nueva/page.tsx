"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Pet {
    _id: string;
    nombre: string;
    especie: string;
}

export default function NewAppointmentPage() {
    const t = useTranslations('ClientPanel.appointments');
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
                alert(t('alerts.success'));
                router.push("/cliente/citas");
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || t('alerts.errorSuccess')}`);
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert(t('alerts.errorSuccess'));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8">{t('loading')}</div>;

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
                                {t('needPet')}
                            </p>
                            <button
                                onClick={() => router.push("/cliente/mascotas")}
                                className="mt-3 text-sm font-medium text-yellow-700 underline hover:text-yellow-600"
                            >
                                {t('goToPets')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('makeAppointment')}</h1>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-sm text-blue-700">
                    💡 {t('stateAppointment')}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Seleccionar Mascota */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('pet')} <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.pet}
                            onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="">{t('selectAPet')}</option>
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
                            {t('date')} <span className="text-red-500">*</span>
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
                            {t('time')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <p className="mt-1 text-sm text-gray-700">
                            {t('advice')}
                        </p>
                    </div>

                    {/* Motivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('reason')} <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder={t('reasonPlaceholder')}
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
                            {submitting ? t('feching') : t('makeAppointment')}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/cliente/citas")}
                            className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
