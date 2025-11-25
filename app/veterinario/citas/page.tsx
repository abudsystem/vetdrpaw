"use client";

import { useState, useEffect } from "react";

interface Appointment {
    _id: string;
    date: string;
    reason: string;
    status: string;
    pet: { _id: string; nombre: string; propietario: { name: string } };
    veterinarian: { _id: string; name: string };
}

interface Pet {
    _id: string;
    nombre: string;
    propietario: { _id: string; name: string };
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function VetAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Search states
    const [clientSearch, setClientSearch] = useState("");
    const [clients, setClients] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [clientPets, setClientPets] = useState<Pet[]>([]);

    const [formData, setFormData] = useState({
        pet: "",
        date: "",
        reason: "",
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (clientSearch.length > 2) {
                searchClients();
            } else {
                setClients([]);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [clientSearch]);

    const fetchData = async () => {
        try {
            const [apptRes, userRes] = await Promise.all([
                fetch("/api/appointments"),
                fetch("/api/users/me")
            ]);

            if (apptRes.ok) {
                const data = await apptRes.json();
                setAppointments(data);
            }
            if (userRes.ok) {
                const data = await userRes.json();
                setCurrentUser(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchClients = async () => {
        try {
            const res = await fetch(`/api/users?role=cliente&search=${clientSearch}`);
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error("Error searching clients:", error);
        }
    };

    const handleClientSelect = async (client: User) => {
        setSelectedClient(client);
        setClients([]);
        setClientSearch(client.name); // Show selected name

        // Fetch pets for this client
        try {
            const res = await fetch(`/api/pets?userId=${client._id}`);
            if (res.ok) {
                const data = await res.json();
                setClientPets(data);
            }
        } catch (error) {
            console.error("Error fetching client pets:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    veterinarian: currentUser._id
                }),
            });

            if (res.ok) {
                setShowForm(false);
                resetForm();
                // Refresh appointments
                const apptRes = await fetch("/api/appointments");
                if (apptRes.ok) {
                    setAppointments(await apptRes.json());
                }
            } else {
                const err = await res.json();
                alert("Error creando cita: " + err.message);
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
        }
    };

    const resetForm = () => {
        setFormData({ pet: "", date: "", reason: "" });
        setSelectedClient(null);
        setClientSearch("");
        setClientPets([]);
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/appointments?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                const apptRes = await fetch("/api/appointments");
                if (apptRes.ok) {
                    setAppointments(await apptRes.json());
                }
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Citas</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) resetForm();
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    {showForm ? "Cancelar" : "Nueva Cita"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl text-black  font-semibold mb-4">Programar Nueva Cita</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Client Search */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Buscar Cliente</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black "
                                placeholder="Nombre o email..."
                                value={clientSearch}
                                onChange={(e) => {
                                    setClientSearch(e.target.value);
                                    if (selectedClient) {
                                        setSelectedClient(null);
                                        setClientPets([]);
                                        setFormData({ ...formData, pet: "" });
                                    }
                                }}
                            />
                            {clients.length > 0 && !selectedClient && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto mt-1">
                                    {clients.map(client => (
                                        <li
                                            key={client._id}
                                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                                            onClick={() => handleClientSelect(client)}
                                        >
                                            <div className="font-medium">{client.name}</div>
                                            <div className="text-xs text-gray-500 text-black">{client.email}</div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Pet Selection */}
                        <div>
                            <label className="block text-sm text-black font-medium text-gray-700">Mascota</label>
                            <select
                                required
                                disabled={!selectedClient}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 disabled:bg-gray-100 text-black"
                                value={formData.pet}
                                onChange={(e) => setFormData({ ...formData, pet: e.target.value })}
                            >
                                <option value="">{selectedClient ? "Seleccione una mascota" : "Primero seleccione un cliente"}</option>
                                {clientPets.map(pet => (
                                    <option key={pet._id} value={pet._id}>
                                        {pet.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-black">Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 text-black">Motivo</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={!formData.pet}
                                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                            >
                                Guardar Cita
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veterinario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((app) => (
                                <tr key={app._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(app.date).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{app.pet?.nombre || 'Desconocido'}</div>
                                        <div className="text-sm text-gray-500">{app.pet?.propietario?.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {app.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {app.veterinarian?.name || 'Sin asignar'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'aceptada' ? 'bg-green-100 text-green-800' :
                                            app.status === 'cancelada' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => updateStatus(app._id, 'aceptada')}
                                            className="text-green-600 hover:text-green-900 mr-3"
                                        >
                                            Aceptar
                                        </button>
                                        <button
                                            onClick={() => updateStatus(app._id, 'cancelada')}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
