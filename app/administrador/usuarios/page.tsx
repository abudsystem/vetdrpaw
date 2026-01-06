"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { UserList } from "@/components/administrador/usuarios/UserList";
import { UserModal } from "@/components/administrador/usuarios/UserModal";
import { Search } from "lucide-react";

export default function AdministradorUsersPage() {
    const { users, loading, deleteUser, updateUser } = useUsers();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleEditClick = (user: User) => {
        setEditingUser(user);
    };

    const handleUpdate = async (formData: { name: string; email: string; role: string }) => {
        if (!editingUser) return;
        const success = await updateUser(editingUser._id, formData);
        if (success) {
            setEditingUser(null);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-black"
                    />
                </div>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <UserList users={filteredUsers} onEdit={handleEditClick} onDelete={deleteUser} />
            )}

            {/* Edit Modal */}
            <UserModal
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                onSave={handleUpdate}
                initialData={editingUser ? { name: editingUser.name, email: editingUser.email, role: editingUser.role } : undefined}
            />
        </div>
    );
}

