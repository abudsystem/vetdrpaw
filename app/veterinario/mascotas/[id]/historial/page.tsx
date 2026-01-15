"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface MedicalRecord {
    _id: string;
    date: string;
    diagnosis: string;
    treatment: string;
    notes: string;
    motivo: string;
    veterinarian: { name: string };
}

interface Appointment {
    _id: string;
    date: string;
    reason: string;
    status: string;
    veterinarian: { name: string };
}

interface Pet {
    _id: string;
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
    propietario: { name: string; email: string };
}

export default function PetHistoryPage({ params }: { params: Promise<{ id: string }> }) {
    const t = useTranslations("VetPanel.patients");
    const { id } = use(params);
    const router = useRouter();
    const [pet, setPet] = useState<Pet | null>(null);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        motivo: "",
        diagnosis: "",
        treatment: "",
        notes: "",
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [petRes, recordsRes, apptRes] = await Promise.all([
                fetch(`/api/pets?id=${id}`),
                fetch(`/api/medical-records?petId=${id}`),
                fetch(`/api/appointments?petId=${id}`)
            ]);

            if (petRes.ok) setPet(await petRes.json());
            if (recordsRes.ok) setRecords(await recordsRes.json());
            if (apptRes.ok) setAppointments(await apptRes.json());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/medical-records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pet: id,
                    motivo: formData.motivo,
                    diagnosis: formData.diagnosis,
                    treatment: formData.treatment,
                    notes: formData.notes
                }),
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({ motivo: "", diagnosis: "", treatment: "", notes: "" });
                fetchData();
            }
        } catch (error) {
            console.error(t("error"), error);
        }
    };

    if (loading) return <div className="p-6">{t("loading")}</div>;
    if (!pet) return <div className="p-6">{t("petNotFound")}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <button
                onClick={() => router.back()}
                className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
            >
                {t("buttonreturn")}
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* HISTORIAL MÉDICO */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">{t("historyTitle")}</h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                        >
                            {showForm ? t("cancel") : t("addRecord")}
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-white p-4 rounded-lg shadow mb-4 border border-indigo-100">
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* MOTIVO */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t("reason")}</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.motivo}
                                        onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t("diagnosis")}</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.diagnosis}
                                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t("treatment")}</label>
                                    <textarea
                                        required
                                        className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                                        rows={3}
                                        value={formData.treatment}
                                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">{t("notesPlus")}</label>
                                    <textarea
                                        className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                                        rows={2}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    {t("saveRecord")}
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {records.length === 0 ? (
                            <p className="text-gray-700 italic">{t("noData")}</p>
                        ) : (
                            records.map((record) => (
                                <div key={record._id} className="bg-white shadow rounded-lg p-4 border-l-4 border-indigo-500">

                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm text-gray-700">
                                            {new Date(record.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            {t("dr")} {record.veterinarian?.name}
                                        </span>
                                    </div>

                                    <p className="text-gray-700"><b>{t("reason")}:</b> {record.motivo}</p>
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">{record.diagnosis}</h3>

                                    <p className="text-gray-600 mb-2">
                                        <span className="font-semibold">{t("treatment")}:</span> {record.treatment}
                                    </p>

                                    {record.notes && (
                                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                            {t("notesPlus")}: {record.notes}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* HISTORIAL DE CITAS */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("historyAppointments")}</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <ul className="divide-y divide-gray-200">
                            {appointments.length === 0 ? (
                                <li className="p-4 text-gray-700 italic">{t("noData")}</li>
                            ) : (
                                appointments.map((appt) => (
                                    <li key={appt._id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between">
                                            <div className="text-sm font-medium text-indigo-600">
                                                {new Date(appt.date).toLocaleString()}
                                            </div>
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'aceptada'
                                                    ? 'bg-green-100 text-green-800'
                                                    : appt.status === 'cancelada'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {appt.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <p><span className="font-semibold">{t("reason")}:</span> {appt.reason}</p>
                                            <p className="text-xs text-gray-700 mt-1">
                                                Vet: {appt.veterinarian?.name || t("noAsigned")}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
