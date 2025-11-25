"use client";

import { useState, useEffect } from "react";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function administradorRolesPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const [modifiedRoles, setModifiedRoles] = useState<{ [key: string]: string }>({});

    const handleRoleChange = (userId: string, newRole: string) => {
        setModifiedRoles(prev => ({ ...prev, [userId]: newRole }));
    };

    const saveRole = async (userId: string) => {
        const newRole = modifiedRoles[userId];
        if (!newRole) return;

        try {
            const res = await fetch(`/api/users?id=${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                const updatedUser = await res.json();
                // Update local users state to reflect change and clear modified state
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
                setModifiedRoles(prev => {
                    const next = { ...prev };
                    delete next[userId];
                    return next;
                });
                alert("Rol actualizado correctamente");
            } else {
                alert("Error al actualizar el rol");
            }
        } catch (error) {
            console.error("Error changing role:", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Roles</h1>
            <p className="mb-6 text-gray-600">Asigna roles de Veterinario o Cliente a los usuarios registrados.</p>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol Actual</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nuevo Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'administrador' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'veterinario' ? 'bg-indigo-100 text-indigo-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <select
                                            value={modifiedRoles[user._id] || user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border text-black"
                                        >
                                            <option value="cliente">Cliente</option>
                                            <option value="veterinario">Veterinario</option>
                                            <option value="administrador">Administrador</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {modifiedRoles[user._id] && modifiedRoles[user._id] !== user.role && (
                                            <button
                                                onClick={() => saveRole(user._id)}
                                                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
                                            >
                                                Actualizar
                                            </button>
                                        )}
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
