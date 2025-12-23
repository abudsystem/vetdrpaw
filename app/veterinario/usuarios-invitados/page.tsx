"use client";

import { useState, useEffect } from "react";
import { Users, Search, PawPrint, Calendar, FileText, Mail, Phone, CheckCircle, Clock } from "lucide-react";
import { PetRegistrationForm } from "@/components/veterinario/PetRegistrationForm";

interface GuestUser {
    _id: string;
    name: string;
    email: string;
    telefono?: string;
    isGuest: boolean;
    activatedAt?: Date;
    createdAt: Date;
}

export default function GuestUsersManagementPage() {
    const [guestUsers, setGuestUsers] = useState<GuestUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<GuestUser | null>(null);
    const [showPetForm, setShowPetForm] = useState(false);

    useEffect(() => {
        fetchGuestUsers();
    }, []);

    const fetchGuestUsers = async () => {
        try {
            const res = await fetch("/api/veterinario/guest-users");
            if (res.ok) {
                const data = await res.json();
                setGuestUsers(data);
            }
        } catch (error) {
            console.error("Error fetching guest users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = guestUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddPet = (user: GuestUser) => {
        setSelectedUser(user);
        setShowPetForm(true);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Usuarios Invitados</h1>
                <p className="text-gray-600">
                    Administra usuarios invitados y agrega mascotas, citas y registros médicos en cualquier momento.
                </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre o email..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm">Total Invitados</p>
                            <p className="text-3xl font-bold">{guestUsers.length}</p>
                        </div>
                        <Users size={40} className="opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm">Activados</p>
                            <p className="text-3xl font-bold">
                                {guestUsers.filter((u) => u.activatedAt).length}
                            </p>
                        </div>
                        <CheckCircle size={40} className="opacity-80" />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm">Pendientes</p>
                            <p className="text-3xl font-bold">
                                {guestUsers.filter((u) => !u.activatedAt).length}
                            </p>
                        </div>
                        <Clock size={40} className="opacity-80" />
                    </div>
                </div>
            </div>

            {/* Users List */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Cargando usuarios...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Users className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">
                        {searchTerm ? "No se encontraron usuarios" : "No hay usuarios invitados aún"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                        >
                            {/* User Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{user.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                        <Mail size={14} />
                                        {user.email}
                                    </div>
                                    {user.telefono && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone size={14} />
                                            {user.telefono}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {user.activatedAt ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            Activado
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                            Pendiente
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleAddPet(user)}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <PawPrint size={16} />
                                    Agregar Mascota
                                </button>
                                <button
                                    onClick={() => window.location.href = `/veterinario/citas?clientId=${user._id}`}
                                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Calendar size={16} />
                                    Programar Cita
                                </button>
                                <button
                                    onClick={() => window.location.href = `/veterinario/mascotas?ownerId=${user._id}`}
                                    className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <FileText size={16} />
                                    Ver Mascotas
                                </button>
                            </div>

                            {/* Created Date */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                    Creado: {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pet Registration Modal */}
            {showPetForm && selectedUser && (
                <PetRegistrationForm
                    ownerId={selectedUser._id}
                    ownerName={selectedUser.name}
                    onClose={() => {
                        setShowPetForm(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={() => {
                        console.log("Pet added successfully");
                    }}
                />
            )}
        </div>
    );
}
