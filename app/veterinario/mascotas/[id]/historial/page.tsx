"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface MedicalRecord {
    _id: string;
    date: string;
    diagnosis: string;
    treatment: string;
    notes: string;
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
    const { id } = use(params);
    const router = useRouter();
    const [pet, setPet] = useState<Pet | null>(null);
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
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

            if (petRes.ok) {
                const data = await petRes.json();
                console.log("Fetched pet data:", data);
                setPet(data);
            }
            if (recordsRes.ok) setRecords(await recordsRes.json());

            // Temporary: Fetch all appointments and filter by pet ID client-side
            // Ideal: Update API to support ?petId=...
            if (apptRes.ok) {
                const allAppts = await apptRes.json();
                setAppointments(allAppts);
            }
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
                body: JSON.stringify({ ...formData, pet: id }),
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({ diagnosis: "", treatment: "", notes: "" });
                fetchData(); // Refresh
            }
        } catch (error) {
            console.error("Error saving record:", error);
        }
    };

    if (loading) return <div className="p-6">Cargando...</div>;
    if (!pet) return <div className="p-6">Mascota no encontrada</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <button
                onClick={() => router.back()}
                className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
            >
                ← Volver
            </button>

            {/* Pet Header */}
            {/*
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{pet.nombre}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                        <div>
                            <span className="font-semibold">Especie:</span> {pet.especie} ({pet.raza})
                        </div>
                        <div>
                            <span className="font-semibold">Edad:</span> {pet.edad} años
                        </div>
                        <div>
                            <span className="font-semibold">Propietario:</span> {pet.propietario?.name}
                        </div>
                    </div>
                </div>
            */}


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Medical History Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Historial Médico</h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                        >
                            {showForm ? "Cancelar" : "+ Agregar Registro"}
                        </button>
                    </div>

                    {showForm && (
                        <div className="bg-white p-4 rounded-lg shadow mb-4 border border-indigo-100">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                                        value={formData.diagnosis}
                                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tratamiento</label>
                                    <textarea
                                        required
                                        className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2"
                                        rows={3}
                                        value={formData.treatment}
                                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notas Adicionales</label>
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
                                    Guardar Registro
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {records.length === 0 ? (
                            <p className="text-gray-500 italic">No hay registros médicos.</p>
                        ) : (
                            records.map((record) => (
                                <div key={record._id} className="bg-white shadow rounded-lg p-4 border-l-4 border-indigo-500">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Dr. {record.veterinarian?.name}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">{record.diagnosis}</h3>
                                    <p className="text-gray-600 mb-2"><span className="font-semibold">Tratamiento:</span> {record.treatment}</p>
                                    {record.notes && (
                                        <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">Note: {record.notes}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Appointment History Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Historial de Citas</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <ul className="divide-y divide-gray-200">
                            {appointments.length === 0 ? (
                                <li className="p-4 text-gray-500 italic">No hay citas registradas.</li>
                            ) : (
                                appointments.map((appt) => (
                                    <li key={appt._id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between">
                                            <div className="text-sm font-medium text-indigo-600">
                                                {new Date(appt.date).toLocaleString()}
                                            </div>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'aceptada' ? 'bg-green-100 text-green-800' :
                                                appt.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <p><span className="font-semibold">Motivo:</span> {appt.reason}</p>
                                            <p className="text-xs text-gray-500 mt-1">Vet: {appt.veterinarian?.name || 'Sin asignar'}</p>
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
