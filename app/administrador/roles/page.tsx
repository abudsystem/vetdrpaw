"use client";

import { useState, useEffect } from "react";
import { RoleList } from "@/components/administrador/roles/RoleList";
import { Search } from "lucide-react";

import { useTranslations } from "next-intl";


interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

export default function administradorRolesPage() {
    const t = useTranslations('AdminDashboard.roles');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
                alert(t("success"));
            } else {
                alert(t("error"));
            }
        } catch (error) {
            console.error("Error changing role:", error);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('title')}</h1>
            <p className="mb-6 text-gray-600">{t('description')}</p>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="text-black w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <RoleList
                    users={filteredUsers}
                    modifiedRoles={modifiedRoles}
                    onRoleChange={handleRoleChange}
                    onSave={saveRole}
                />
            )}
        </div>
    );
}
